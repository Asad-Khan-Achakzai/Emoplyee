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

// Middleware for handling express validator errors.

const { validationResult } = require('express-validator');

const errorFormatter = ({
  location, msg, param, value, nestedErrors,
}) => msg;

module.exports = (req, res, next) => {
  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    const err = errors.mapped();
    return next({
      name: 'ValidationError',
      errors: err,
      status: 400,
    });
  }
  return next();
};
