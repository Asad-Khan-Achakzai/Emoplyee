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
const mongoose = require('mongoose');
const { to } = require('await-to-js');
const nodemailer = require('nodemailer');
var handlebars = require('handlebars');
var fs = require('fs');

// Model Imports
const Employee = mongoose.model('Employee');
const Project = mongoose.model('Project');

// App dependencies
const { winstonLog } = require('../common/common');
const constants = require('../../config/constants');
const { responseMessages } = require('./project.constants');

/**
 * Helper function to create request body of sendInvite
 * @param {Object} req
 * @returns {Object}
 */
const constructSendInviteReqBody = (req) => ({
  email: req.body.email,
  type: req.body.type,
  project_in: [
    {
      project_id: req.body.projectID,
      project_name: req.body.projectName,
      role: req.body.role,
      status: constants.invitationStatus.pending,
    },
  ],
});

/**
 * Function to read html file
 * @param {String} path
 * @param {Object} callback
 */
const readHTMLFile = (path, callback) => {
  fs.readFile(path, { encoding: 'utf-8' }, (err, html) => {
    if (err) {
      callback(err);
      throw err;
    } else {
      callback(null, html);
    }
  });
};

/**
 * Helper function to send invitation
 * @param {Object} req
 * @returns {Promise<*>}
 */
const sendInvite = async (req, requestBody) => {
  const role = requestBody.project_in[0].role;
  const projectName = requestBody.project_in[0].project_name;
  const mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.SENDER_EMAIL,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      accessToken: process.env.GOOGLE_ACCESS_TOKEN,
    },
  });
  return new Promise((resolve, reject) => {
    readHTMLFile(
      __dirname + constants.emailInvitationFilename,
      function (err, html) {
        if (err) {
          winstonLog(
            req,
            constants.logLevel.error,
            `Error in reading html file. Error : ${err}`
          );
          return reject(err);
        }
        const template = handlebars.compile(html);
        const replacements = {
          projectName: projectName,
          role: role,
          frontEndUrl: process.env.FRONTEND_URL,
        };
        const htmlToSend = template(replacements);
        const mailDetails = {
          from: process.env.SENDER_EMAIL,
          to: requestBody.email,
          subject: constants.invitationSubject,
          html: htmlToSend,
        };

        mailTransporter.sendMail(mailDetails, async (err, data) => {
          if (err) {
            winstonLog(
              req,
              constants.logLevel.error,
              `Email could not be sent to ${requestBody.email}. Error : ${err}`
            );
            return reject(err);
          } else {
            winstonLog(
              req,
              constants.logLevel.info,
              `Email sent successfully to the recipient : ${requestBody.email}`
            );
            winstonLog(
              req,
              constants.logLevel.info,
              `Adding new user with email: ${req.body.email} in database.`
            );
            const [employeeError, employee] = await to(
              Employee.findOneAndUpdate(
                { email: requestBody.email },
                {
                  $addToSet: { project_in: requestBody.project_in },
                  $set: { type: requestBody.type },
                },
                { upsert: true, new: true }
              )
            );

            let error = null; // to store error if there is an error in updating project

            if (employee) {
              winstonLog(
                req,
                constants.logLevel.info,
                `New user with email: ${requestBody.email} has been added successfully.`
              );
              const [updateProjectError, updateProject] = await to(
                Project.findOneAndUpdate(
                  { _id: requestBody.project_in[0].project_id }, // we are always passing only 1 object in the array
                  { $addToSet: { project_members: `${employee._id}` } }
                )
              );
              winstonLog(
                req,
                constants.logLevel.info,
                `Adding user ID: ${employee._id} in project ID: ${req.body.projectID}.`
              );
              if (updateProjectError) {
                winstonLog(
                  req,
                  constants.logLevel.info,
                  `Failed to add user ID: ${employee._id} in project ID: ${req.body.projectID}. Error: ${updateProjectError}`
                );
                error = updateProjectError;
              } else {
                winstonLog(
                  req,
                  constants.logLevel.info,
                  `User ID: ${employee._id} has been added successfully in project ID: ${req.body.projectID}.`
                );
              }
            }
            if (employeeError || error) {
              winstonLog(
                req,
                constants.logLevel.error,
                `Failed to add new user with emial: ${requestBody.email} in database. Error: ${employeeError}`
              );
              return reject(employeeError || error);
            }
            return resolve(employee);
          }
        });
      }
    );
  });
};

/**
 * Helper function to create add project req body
 * @param {Object} req
 * @returns {Object}
 */
const createAddProjectReqBody = (req) => ({
  name: req.body.name,
  description: req.body.description,
  fileUrl: req.body.fileUrl,
});
/**
 * Helper function to add new project
 * @param {Object} req
 * @returns {Promise<Object>} // In case of error it will return error else data
 */
const addProject = async (req, requestBody) => {
  const newProject = new Project(requestBody);

  const [projectError, project] = await to(newProject.save());
  return new Promise((resolve, reject) => {
    if (projectError) reject(projectError);
    resolve(project);
  });
};

/**
 * Helper function to delete project by ID
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise<Object>} // In case of error it will return error else data
 */
const deleteProjectByID = async (req) => {
  const [deleteProjectError, deleteProject] = await to(
    Project.findByIdAndDelete(req.params.projectID)
  );
  return new Promise((resolve, reject) => {
    if (deleteProjectError) reject(deleteProjectError);
    resolve(deleteProject);
  });
};

/**
 * Helper function to get project details by ID
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Promise<Object>} // In case of error it will return error else data
 */
const getProjectDetailsByID = async (req) => {
  const [projectDetailsError, projectDetails] = await to(
    Project.findById(req.params.projectID).populate('project_members')
  );
  return new Promise((resolve, reject) => {
    if (projectDetailsError) reject(projectDetailsError);
    if (projectDetails) {
      const projectMembers = projectDetails.project_members;
      projectMembers.map((member) => {
        member.project_in = member.project_in.filter(
          (memberObj) => memberObj.project_id === req.params.projectID
        );
        return member;
      });
    }
    resolve(projectDetails);
  });
};

/**
 * Helper function to get projects list by employee ID
 * @param {Object} req
 * @returns {Promise<Object>} // In case of error it will return error else data
 */
const getProjectListByEmployeeID = async (req) => {
  const [employeeError, employee] = await to(
    Employee.findById(req.params.employeeID)
  );
  return new Promise(async (resolve, reject) => {
    if (employeeError) return reject(employeeError);
    if (employee) {
      const responseObj = {};
      if (employee.type === constants.userTypes.admin) {
        winstonLog(
          req,
          constants.logLevel.info,
          `Fetching projects for admin user: ${employee.email}.`
        );
        const [projectsError, projects] = await to(Project.find());
        if (projectsError) {
          winstonLog(
            req,
            constants.logLevel.error,
            `Failed to fetch projects for admin user: ${employee.email}.`
          );
          return reject(projectsError);
        }
        responseObj.projects = projects.map((project) => ({
          id: project._id,
          name: project.name,
        }));
        winstonLog(
          req,
          constants.logLevel.info,
          `Projects have been successfully fetched for admin user: ${employee.email}.`
        );
      } else {
        responseObj.projects = employee.project_in;
      }
      winstonLog(
        req,
        constants.logLevel.info,
        `User: ${employee.email}/'s projects list has been fetched successfully.`
      );
      return resolve(responseObj);
    }
  });
};

/**
 * Updates project with given id
 * @param {String} _id
 * @param {Object} updates
 * @param {Object} res
 * @returns {res} // In case of error it will return error else data
 */
const updateProjectByID = async (req, _id, updates, res) => {
  try {
    const [updateProjectError, updateProject] = await to(
      Project.findOneAndUpdate(
        {
          _id: _id,
        },
        {
          $set: updates,
        },
        { upsert: true, new: true }
      ).populate('project_members')
    );

    if (updateProjectError) {
      winstonLog(
        req,
        constants.logLevel.error,
        `${responseMessages.updateProject.failure} Error: ${updateProjectError}`
      );
      res.status(500);
      return res.json({
        success: 0,
        message: responseMessages.updateProject.failure,
        data: updateProjectError,
      });
    }
    // mapping the project members
    const projectMembers = updateProject.project_members;
    projectMembers.map((member) => {
      member.project_in = member.project_in.filter(
        (memberObj) => memberObj.project_id === _id
      );
      return member;
    });
    winstonLog(
      req,
      constants.logLevel.info,
      `${responseMessages.updateProject.success}`
    );
    res.status(200);
    return res.json({
      success: 1,
      message: responseMessages.updateProject.success,
      data: updateProject,
    });
  } catch (error) {
    winstonLog(
      req,
      constants.logLevel.error,
      `${responseMessages.updateProject.failure} Error: ${error}`
    );
    return res.status(500).send(error);
  }
};

/**
 * Helper function add employee in the as an admin
 * @param {String} employeeEmail
 * @param {String} employeeName
 * @returns {Object} // returns employee object
 */
const addEmployeeAsAnAdmin = async (employeeEmail, employeeName) => {
  winstonLog(
    {},
    constants.logLevel.info,
    `Adding employee: ${employeeEmail} in the DB.`
  );
  const employeeObj = {
    email: employeeEmail,
    name: employeeName,
    type: constants.userTypes.admin,
  };
  const [employeeError, employee] = await to(
    Employee.findOneAndUpdate(
      { email: employeeObj.email },
      { $set: employeeObj },
      { upsert: true, new: true }
    )
  );
  if (employeeError) {
    winstonLog(
      {},
      constants.logLevel.error,
      `Failed to add employee Error: ${employeeError}.`
    );
    return employeeError;
  }
  winstonLog(
    {},
    constants.logLevel.info,
    `Employee: ${employee.email} has been added successfully.`
  );
  return employee;
};
module.exports = {
  sendInvite,
  addProject,
  deleteProjectByID,
  getProjectDetailsByID,
  constructSendInviteReqBody,
  createAddProjectReqBody,
  updateProjectByID,
  getProjectListByEmployeeID,
  addEmployeeAsAnAdmin,
};
