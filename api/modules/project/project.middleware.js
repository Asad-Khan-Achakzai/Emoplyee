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
const { param, query, check } = require('express-validator');

// Importing app dependencies
const common = require('../common/common');

module.exports = {
  validateSendInviteParams: [
    check('email', '3001').exists({ checkFalsy: true }),
    check('email', '3002').custom(common.emailValidator),
    check('projectID', '3003').exists({ checkFalsy: true }),
    check('role', '3004').exists({ checkFalsy: true }),
    check('role', '3005').isString(),
  ],
  validateAddProjectParams: [
    check('name', '3007').exists({ checkFalsy: true }),
    check('name', '3011').isString(),
    check('description', '3008').exists({ checkFalsy: true }),
    check('description', '3009').isString(),
    check('fileUrl', '3010').exists({ checkFalsy: true }),
    // TODO: Will uncomment in future commit
    // check('fileUrl', '3012').custom(common.emailValidator),
  ],
  validateDeleteProjectParams: [
    param('projectID', '3003').exists({ checkFalsy: true }),
    param('projectID', '3014').isAlphanumeric(),
  ],
  validateGetProjectDetailsParams: [
    param('projectID', '3003').exists({ checkFalsy: true }),
    param('projectID', '3014').isAlphanumeric(),
  ],
  validateUpdateProjectParams: [
    check('projectID', '3003').exists({ checkFalsy: true }),
    check('projectID', '3014').isString(),
    check('name', '3007').exists({ checkFalsy: true }),
    check('name', '3011').isString(),
    check('description', '3008').exists({ checkFalsy: true }),
    check('description', '3009').isString(),
    check('fileUrl', '3010').exists({ checkFalsy: true }),
    // TODO: Will uncomment in future commit
    // check('fileUrl', '3012').custom(common.emailValidator),
  ],
  validateGetProjectsListParams: [
    param('employeeID', '3018').exists({ checkFalsy: true }),
    param('employeeID', '3019').isAlphanumeric(),
  ],
};
