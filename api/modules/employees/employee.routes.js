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

// Constant imports
const constants = require('../../config/constants');

// App dependencies
const passport = require('../../config/passport');
const errorMiddleware = require('../common/error-middleware');
const employeeMiddleware = require('./employee.middleware');
const employeeController = require('./employee.controller');

const resource = '/employee';

module.exports = (app) => {
  /**
   * Route to get employee performance for specific month.
   */
  app.get(
    `${resource}/performance/:projectID/:monthName`,
    passport.isAuthenticated,
    employeeMiddleware.validateGetEmployeePerformanceByMonthParams,
    errorMiddleware,
    employeeController.getEmployeePerformanceByMonth,
  );

  /**
   * Route to get monthly summary.
   */
  app.get(
    `${resource}/summary/:projectID/:monthName`,
    passport.isAuthenticated,
    employeeMiddleware.validateGetMonthlySummaryParams,
    errorMiddleware,
    employeeController.getMonthlySummary,
  );

  /**
   * Route to add new comment in week data by ID.
   */
  app.post(
    `${resource}/week/:ID`,
    passport.isAuthenticated,
    employeeMiddleware.validateAddCommentParams,
    errorMiddleware,
    employeeController.addNewComment,
  );

  /**
  * Route to login user with google.
  */
  app.get(
    `${resource}/login`,
    employeeMiddleware.validateLoginParams,
    errorMiddleware,
    employeeController.googleLogin,
  );

  /**
  * Route to update user role by project ID.
  */
  app.post(
    `${resource}/:employeeID/update/:projectID`,
    passport.isAuthenticated,
    employeeMiddleware.validateUpdateEmployeeRoleByProjectIDParams,
    errorMiddleware,
    employeeController.updateEmployeeRoleByProjectID,
  );
};
