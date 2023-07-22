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

// Npm Imports
const { to } = require('await-to-js');
const axios = require('axios');

// Mongoose Import
const mongoose = require('mongoose');

// Collections Imports
const Week = mongoose.model('Week');
const Month = mongoose.model('Month');
const Employee = mongoose.model('Employee');
const Project = mongoose.model('Project');

// Constant imports
const constants = require('../../config/constants');
const { responseMessages } = require('./employee.constants');

// App dependencies
const { winstonLog } = require('../common/common');
const employeeConstants = require('./employee.constants');
const passport = require('../../config/passport');

/**
 * Controller function to get employee performance by month
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 */
const getEmployeePerformanceByMonth = async (req, res, next) => {
  winstonLog(
    req,
    constants.logLevel.info,
    `Fetching employee performance by month: ${req.params.monthName} for project: ${req.params.projectID}`
  );
  const [employeePerformanceError, employeePerformance] = await to(
    Week.find({
      month: req.params.monthName,
      project_id: req.params.projectID,
    }).populate(
      'employee carryover_stories new_stories_assigned stories_completed'
    )
  );

  if (employeePerformanceError) {
    winstonLog(
      req,
      constants.logLevel.error,
      `Error in fetching employee performance by month: ${req.params.monthName} for project: ${req.params.projectID} Error: ${employeePerformanceError}`
    );
    res.status(500);
    return next({ msgCode: '1003' });
  }

  winstonLog(
    req,
    employeePerformance.length
      ? constants.logLevel.info
      : constants.logLevel.error,
    employeePerformance.length
      ? `Employee performance by month: ${req.params.monthName} for project: ${req.params.projectID} has been fetched successfully.`
      : `Failed to fetch employee performance by month: ${req.params.monthName} for project: ${req.params.projectID} Error: No data found.`
  );

  res.status(200);
  return res.json({
    success: employeePerformance.length ? 1 : 0,
    message: employeePerformance.length
      ? responseMessages.getEmployeePerformance.success
      : `${responseMessages.getEmployeePerformance.failure} No data found.`,
    data: employeePerformance,
  });
};

/**
 * Controller function to get month summary by month
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Object}
 */
const getMonthlySummary = async (req, res, next) => {
  winstonLog(
    req,
    constants.logLevel.info,
    `Fetching month summary by month: ${req.params.monthName} for project: ${req.params.projectID}`
  );

  const [err, monthlySummary] = await to(
    Month.find({
      month: req.params.monthName,
      project_id: req.params.projectID,
    }).populate('employee')
  );
  if (err) {
    winstonLog(
      req,
      constants.logLevel.error,
      `Error in fetching month summary for month: ${req.params.monthName} for project: ${req.params.projectID} Error: ${err}`
    );
    res.status(500);
    return next({ msgCode: '1006' });
  }

  winstonLog(
    req,
    monthlySummary.length ? constants.logLevel.info : constants.logLevel.error,
    monthlySummary.length
      ? `Monthly summary for month: ${req.params.monthName} for project: ${req.params.projectID} has been fetched successfully.`
      : `Failed to fetch monthly summary for month: ${req.params.monthName} for project: ${req.params.projectID} Error: No data found.`
  );

  res.status(200);
  return res.json({
    success: monthlySummary.length ? 1 : 0,
    message: monthlySummary.length
      ? responseMessages.getMonthlySummary.success
      : `${responseMessages.getMonthlySummary.failure} No data found.`,
    data: monthlySummary,
  });
};

/**
 * Helper function to create week query object
 * @param {Object} req
 * @returns {Object}
 */
const constructWeekQueryObj = (req) => ({
  filter: { _id: req.params.ID },
  data: { $push: { notable_comments: req.body.comment } },
});

/**
 * Helper function to create employee query obj
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Object}
 */
const createEmployeeQueryObj = (employee) => ({
  filter: { email: employee.email },
  data: {
    $set: {
      email: employee.email,
      name: employee.name,
      picture: employee.picture,
      'project_in.$[].status': 1, // TODO: Will update specific project for which invitation was received.
    },
    multi: true,
  },
});
/**
 * Function to add new comment
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Object}
 */
const addNewComment = async (req, res, next) => {
  winstonLog(
    req,
    constants.logLevel.info,
    `Adding new comment in week. WeekID: ${req.params.ID}, comment: ${req.body.comment}`
  );
  const weekQueryObj = constructWeekQueryObj(req);
  const [weekError, week] = await to(
    Week.findOneAndUpdate(weekQueryObj.filter, weekQueryObj.data, {
      new: true,
    }).populate(
      'employee carryover_stories new_stories_assigned stories_completed'
    )
  );
  if (weekError) {
    winstonLog(
      req,
      constants.logLevel.error,
      `Failed to add new comment in week. WeekID: ${req.params.ID}, comment: ${req.body.comment} Error: ${weekError}`
    );
    res.status(500);
    return next({ msgCode: '1009' });
  }
  winstonLog(
    req,
    constants.logLevel.info,
    `New comment: ${req.body.comment} in week: ${req.params.ID} has been added successfully`
  );
  return res.json({
    success: 1,
    message: responseMessages.addNewComment.success,
    data: week,
  });
};

/**
 * Function to verify token from google and save user in DB
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Object}
 */

const googleLogin = async (req, res, next) => {
  winstonLog(
    req,
    constants.logLevel.info,
    `Verifing access token: ${req.query.token} from Google APIs.`
  );
  const url = `${employeeConstants.googleAPIsUrl}${req.query.token}`;
  const [userError, user] = await to(axios.get(url));

  if (userError) {
    winstonLog(
      req,
      constants.logLevel.error,
      `Failed to verify token:${req.query.token} from Google Error: ${userError.response.statusText}`
    );
    res.status(401);
    return next({ msgCode: '1011' });
  }
  winstonLog(req, constants.logLevel.info, `Fetching user: ${user.data.email}`);
  const employeeData = createEmployeeQueryObj(user.data);
  const [employeeError, employee] = await to(
    Employee.findOneAndUpdate(employeeData.filter, employeeData.data, {
      upsert: true,
      new: true,
    })
  );

  if (employeeError) {
    winstonLog(
      req,
      constants.logLevel.error,
      `Failed to fetch user: ${user.data.email}`
    );
    res.status(500);
    return next({ msgCode: '1011' });
  }
  const [tokenErr, token] = await to(passport.signJwtToken({ ...employee }));
  if (tokenErr) {
    winstonLog(
      req,
      constants.logLevel.error,
      `Failed to create jwt token for user: ${user.data.email} Error: ${tokenErr}`
    );
    res.status(500);
    return next({ msgCode: '1012' });
  }
  const responseObj = { employee, token };
  // Fetching all projects for admin user
  if (employee.type === constants.userTypes.admin) {
    winstonLog(
      req,
      constants.logLevel.info,
      `Fetching projects for admin user: ${user.data.email}.`
    );
    const [projectsError, projects] = await to(Project.find());
    if (projectsError) {
      winstonLog(
        req,
        constants.logLevel.error,
        `Failed to fetch projects for admin user: ${user.data.email}.`
      );
      res.status(500);
      return next({ msgCode: '1016' });
    }
    const projectRecords = [];
    projects.forEach((project) => {
      projectRecords.push({ id: project._id, name: project.name });
    });
    responseObj.projects = projectRecords;
    winstonLog(
      req,
      constants.logLevel.info,
      `Projects have been successfully fetched for admin user: ${user.data.email}.`
    );
  }

  winstonLog(
    req,
    constants.logLevel.info,
    `User: ${user.data.email} has been fetched successfully.`
  );
  return res.json({
    success: 1,
    message: 'User has been fetched successfully.',
    data: responseObj,
  });
};

/**
 * Helper function to create updateEmployeeRoleByProjectID req body
 * @param {Object} req
 * @returns {Object}
 */
const createUpdateEmployeeRoleQueryObj = (req) => ({
  filter: {
    _id: req.params.employeeID,
    project_in: {
      $elemMatch: {
        project_id: req.params.projectID,
      },
    },
  },
  data: req.body.remove
    ? {
        $pull: {
          project_in: {
            project_id: req.params.projectID,
          },
        },
      }
    : {
        $set: {
          'project_in.$.role': req.body.role,
        },
      },
});

/**
 * Controller function to update user role
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns
 */
const updateEmployeeRoleByProjectID = async (req, res, next) => {
  winstonLog(
    req,
    constants.logLevel.info,
    `Updating role of user ID: '${req.params.employeeID}' in project ID: '${req.params.projectID}'`
  );
  const updateEmployeeRoleQueryObj = createUpdateEmployeeRoleQueryObj(req);
  const [updateRoleError, updateRole] = await to(
    Employee.findOneAndUpdate(
      updateEmployeeRoleQueryObj.filter,
      updateEmployeeRoleQueryObj.data
    )
  );
  if (req.body.remove) {
    winstonLog(
      req,
      constants.logLevel.info,
      `Removing user ID: '${req.params.employeeID}' from project ID: '${req.params.projectID}'`
    );
    const [projectError, project] = await to(
      Project.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(req.params.projectID) },
        { $pull: { project_members: { $in: [req.params.employeeID] } } }
      )
    );
    if (projectError) {
      winstonLog(
        req,
        constants.logLevel.error,
        `Failed to remove user ID: '${req.params.employeeID}' from project ID: '${req.params.projectID}' Error: ${projectError}`
      );
      res.status(500);
      return next({ msgCode: '1015' });
    }
    winstonLog(
      req,
      constants.logLevel.info,
      `User ID: '${req.params.employeeID}' from project ID: '${req.params.projectID}' has been successfuly removed`
    );
  }
  if (updateRoleError) {
    winstonLog(
      req,
      constants.logLevel.error,
      `Failed to update role of user ID: '${req.params.employeeID}' in project ID: '${req.params.projectID}' Error: ${updateRoleError}`
    );
    res.status(500);
    return next({ msgCode: '1015' });
  }
  winstonLog(
    req,
    constants.logLevel.info,
    `Role of user ID: '${req.params.employeeID}' in project ID: '${req.params.projectID}'  has been updated successfully`
  );
  return res.json({
    success: 1,
    message: responseMessages.updateEmployeeRoleByProjectID.success,
    data: {},
  });
};

module.exports = {
  getEmployeePerformanceByMonth,
  getMonthlySummary,
  addNewComment,
  googleLogin,
  updateEmployeeRoleByProjectID,
};
