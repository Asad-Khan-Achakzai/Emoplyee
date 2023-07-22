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

// Importing npm dependencies
const { param, query, check, oneOf } = require('express-validator');

// constants Imports
const constants = require('../../config/constants');

module.exports = {
  validateGetEmployeePerformanceByMonthParams: [
    param('monthName', '1002').isAlpha(),
    param('monthName', '1005').isIn(constants.months),
  ],
  validateGetMonthlySummaryParams: [
    param('monthName', '1002').isAlpha(),
    param('monthName', '1005').isIn(constants.months),
  ],
  validateAddCommentParams: [
    param('ID', '1007').isAlphanumeric(),
    check('comment', '1008').exists({ checkFalsy: true }).isString(),
  ],
  validateLoginParams: [
    query('token', '1010').exists({ checkFalsy: true }).isString(),
  ],
  validateUpdateEmployeeRoleByProjectIDParams: [
    oneOf([[
      check('remove', '1013').isBoolean(),
    ], [
      check('role', '1014').isIn(constants.userRole),
    ]], constants.oneOfErrors),
  ],
};
