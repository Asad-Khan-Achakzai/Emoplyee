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

// NPM imports
const { to } = require('await-to-js');

// Constant imports
const constants = require('../../config/constants');
const { responseMessages } = require('./project.constants');

// App dependencies
const { winstonLog } = require('../common/common');
const projectHelper = require('./project.helper');

/**
 * Route to send invitation email to users
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 */
const sendInvite = async (req, res, next) => {
  winstonLog(req, constants.logLevel.info, `Sending email invitation to: ${req.body.email}`);
  const requestObj = projectHelper.constructSendInviteReqBody(req);
  const [emailStatusError, emailStatus] = await to(projectHelper.sendInvite(req, requestObj));

  if (emailStatusError) {
    winstonLog(req, constants.logLevel.error, `${responseMessages.sendInvite.failure} Error: ${emailStatusError}`);
    res.status(500);
    return next({ msgCode: '3006' });
  }
  winstonLog(req, constants.logLevel.info, `${responseMessages.sendInvite.success}`);
  res.status(200);
  return res.json({
    success: 1,
    message: responseMessages.sendInvite.success,
    data: emailStatus,
  });
};

/**
 * Route to add new project
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 */
const addProject = async (req, res, next) => {
  const addProjectReqObj = projectHelper.createAddProjectReqBody(req);
  winstonLog(req, constants.logLevel.info, `Adding project: ${req.body.name} in database.`);
  const requestObj = projectHelper.createAddProjectReqBody(req);
  const [addNewProjectError, addNewProject] = await to(projectHelper.addProject(req, requestObj));
  if (addNewProjectError) {
    winstonLog(req, constants.logLevel.error, `${responseMessages.addProject.failure} Error: ${addNewProjectError}`);
    res.status(500);
    return res.json({
      success: 0,
      message: responseMessages.getProjectDetailsByID.failure,
      data: addNewProjectError,
    });
  }
  winstonLog(req, constants.logLevel.info, `${responseMessages.addProject.success}`);
  res.status(200);
  return res.json({
    success: 1,
    message: responseMessages.addProject.success,
    data: addNewProject,
  });
};

/**
 * Controller function to delete project by ID
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 */
const deleteProjectByID = async (req, res, next) => {
  winstonLog(req, constants.logLevel.info, `Deleting project with ID: ${req.param.projectID}`);
  const [deleteProjectError, deleteProject] = await to(projectHelper.deleteProjectByID(req));

  if (deleteProjectError) {
    winstonLog(req, constants.logLevel.error, `${responseMessages.deleteProjectByID.failure} with ID: ${req.param.projectID} Error: ${deleteProjectError}`);
    res.status(500);
    return next({ msgCode: '3015' });
  }
  winstonLog(req, constants.logLevel.info, `${responseMessages.deleteProjectByID.success}`);
  res.status(200);
  return res.json({
    success: 1,
    message: responseMessages.deleteProjectByID.success,
    data: {},
  });
};

/**
 * Controller function to get project details by ID
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 */
const getProjectDetailsByID = async (req, res, next) => {
  winstonLog(req, constants.logLevel.info, `Fetching project details with ID: ${req.params.projectID}`);
  const [projectDetailsError, projectDetails] = await to(projectHelper.getProjectDetailsByID(req));

  if (projectDetailsError) {
    winstonLog(req, constants.logLevel.error, `${responseMessages.getProjectDetailsByID.failure} with ID: ${req.params.projectID} Error: ${projectDetailsError}`);
    res.status(500);
    return next({ msgCode: '3016' });
  }
  winstonLog(req, constants.logLevel.info, `Project details with ID: ${req.params.projectID} have been fetched successfully.`);
  res.status(200);
  return res.json({
    success: 1,
    message: responseMessages.getProjectDetailsByID.success,
    data: projectDetails,
  });
};

/**
 * Controller function to get projects list by employee ID
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 */
const getProjectListByEmployeeID = async (req, res, next) => {
  winstonLog(req, constants.logLevel.info, `Fetching projects list with employee ID: ${req.params.employeeID}`);
  const [projectsListError, projectsList] = await to(projectHelper.getProjectListByEmployeeID(req));

  if (projectsListError) {
    winstonLog(req, constants.logLevel.error, `${responseMessages.getProjectsListByEmployeeID.failure} with ID: ${req.params.employeeID} Error: ${projectsListError}`);
    res.status(500);
    return next({ msgCode: '3017' });
  }
  winstonLog(req, constants.logLevel.info, `Projects List with employee ID: ${req.params.employeeID} have been fetched successfully.`);
  res.status(200);
  return res.json({
    success: 1,
    message: responseMessages.getProjectsListByEmployeeID.success,
    data: projectsList,
  });
};


/**
 * Updates project with given id
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 */
const updateProject = async (req, res) => {
  try {
    winstonLog(req, constants.logLevel.info, `Updating project with ID: ${req.params.projectID}`);
    const _id = req.params.projectID;
    let updates = req.body;
    projectHelper.updateProjectByID(req, _id, updates, res);
  } catch (error) {
    winstonLog(req, constants.logLevel.error, `Failed to update project. Error: ${error}`);
    return res.status(500).send(error);
  }
};

module.exports = {
  sendInvite,
  addProject,
  deleteProjectByID,
  getProjectDetailsByID,
  updateProject,
  getProjectListByEmployeeID,
};
