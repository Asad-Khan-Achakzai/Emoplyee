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
const glob = require('glob');

// App dependencies
const { winstonLog } = require('../modules/common/common');
const constants = require('./constants');

winstonLog({}, constants.logLevel.info, 'Loading error messages');
const routePath = 'modules/**/*.errors.json';
let errorObject = {
  '0001': {
    msg: 'employeeID not available in provided token.',
  },
  '0002': {
    msg: 'No Employee found with the provided employeeID',
  },
  '0003': {
    msg: 'Employee is not authenticated.',
  },
  '0004': {
    msg: 'Employee is not authorized to visit this API.',
  },
  '0005': {
    msg: 'Failed to decode JWT token.',
  },
  '0006': {
    msg: 'Session has expired. Please login again.',
  },
};

glob.sync(routePath).forEach((file) => {
  errorObject = {
    ...errorObject,
    ...require(`../${file}`),
  };
  winstonLog({}, constants.logLevel.info, `'${file}' is loaded`);
});

module.exports = errorObject;
