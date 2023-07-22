/**
 Copyright (c) 2022, Xgrid Inc, http://xgrid.co

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

// NPM module imports
const { map } = require('lodash');
const swaggerUi = require('swagger-ui-express');

// App dependencies
const errorCodes = require('./errors');
const swaggerDocument = require('../swagger.json');
const { winstonLog } = require('../modules/common/common');
const constants = require('./constants');

module.exports = (app) => {
  require('./routes')(app);

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.get('/*', (req, res) => {
    res.status(404);
    res.json({
      success: 0,
      message: 'Not Found',
      response: 404,
      data: {},
    });
  });

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handlers
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    // If the error is a stack error log it's stack
    winstonLog(
      req,
      constants.logLevel.error,
      `An error occurred in processing the API call: ${
        err.stack ? err.stack : JSON.stringify(err)
      }`,
    );
    if (err.name === 'ValidationError') {
      // to handle conditional error (oneOf)
      if (Object.keys(err.errors).length === 1 && err.errors._error === constants.oneOfErrors) {
        const oneOfErrorsObj = {};
        const _validator = req['express-validator#contexts'];
        for (let i = 0; i < _validator.length; i += 1) {
          for (let k = 0; k < _validator[i]._errors.length; k += 1) {
            const nestedErrorArray = _validator[i]._errors[k].nestedErrors.filter((nestedErr) => nestedErr.value);
            nestedErrorArray.forEach((error) => {
              if (error.msg !== 'Invalid value') {
                oneOfErrorsObj[error.param] = error.msg;
              }
            });
            if (_validator[i]._errors[k].nestedErrors && !nestedErrorArray.length) {
              for (let j = 0; j < _validator[i]._errors[k].nestedErrors.length; j += 1) {
                if (_validator[i]._errors[k].nestedErrors[j].msg !== 'Invalid value') {
                  oneOfErrorsObj[_validator[i]._errors[k].nestedErrors[j].param] = _validator[i]._errors[k].nestedErrors[j].msg;
                }
              }
            }
          }
        }
        err.errors = oneOfErrorsObj;
        if (err.errors._error) delete err.errors._error;
      }
      const errors = map(err.errors, (code) => ({
        message: errorCodes[code].msg,
        code,
      }));
      res.json({
        success: 0,
        message: 'Errors encountered while validating request parameters.',
        data: {},
        errors,
      });
    } else if (err.status === 404) {
      res.json({
        success: 0,
        message: 'Not Found.',
        data: {},
      });
    } else if (err.msgCode) {
      const data = err.data || {};
      res.json({
        success: 0,
        message: errorCodes[err.msgCode].msg,
        data,
      });
    } else if (err.message) {
      const data = err.data || {};
      res.json({
        success: 0,
        message: err.message,
        data,
      });
    } else {
      res.json({
        success: 0,
        message: 'Something went wrong. Please try again.',
        data: {},
      });
    }
  });
};
