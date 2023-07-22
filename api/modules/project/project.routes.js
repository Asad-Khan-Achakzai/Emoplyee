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

// App dependencies
const passport = require('../../config/passport');
const errorMiddleware = require('../common/error-middleware');
const projectController = require('./project.controller');
const projectMiddleware = require('./project.middleware');

// Resorce Decleration
const resource = '/project';

module.exports = (app) => {
  /**
   * Route to send invitation link to users in project.
   */
  app.post(
    `${resource}/sendInvitation`,
    passport.isAuthenticated,
    projectMiddleware.validateSendInviteParams,
    errorMiddleware,
    projectController.sendInvite,
  );

  /**
   * Route to add new project.
   */
  app.post(
    `${resource}/add`,
    passport.isAuthenticated,
    projectMiddleware.validateAddProjectParams,
    errorMiddleware,
    projectController.addProject,
  );

  /**
   * Route to delete project by ID.
   */
  app.delete(
    `${resource}/:projectID/delete`,
    passport.isAuthenticated,
    projectMiddleware.validateDeleteProjectParams,
    errorMiddleware,
    projectController.deleteProjectByID,
  );

  /**
   * Route to get project details by ID.
   */
  app.get(
    `${resource}/:projectID/details`,
    passport.isAuthenticated,
    projectMiddleware.validateGetProjectDetailsParams,
    errorMiddleware,
    projectController.getProjectDetailsByID,
  );

  /**
  * Route to update project by ID.
  */
  app.put(
    `${resource}/:projectID/update`,
    passport.isAuthenticated,
    projectMiddleware.validateUpdateProjectParams,
    errorMiddleware,
    projectController.updateProject
  );

  /**
  * Route to get projects list by employeeID.
  */
  app.get(
    `${resource}/:employeeID`,
    passport.isAuthenticated,
    projectMiddleware.validateGetProjectsListParams,
    errorMiddleware,
    projectController.getProjectListByEmployeeID,
  );
};
