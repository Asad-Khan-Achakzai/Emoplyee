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
const fs = require('fs');
const winston = require('../../config/winston');
const constants = require('../../config/constants');

/**
 * Utility function to log message using winston.
 * @param {Object} req - Request object
 * @param {String} level - winston log level [info | debug | error | warn]
 * @param {String} message - Message to be logged
 * @param {Object} additionalInfo - any additional Information that we want to log
 */
const winstonLog = (req, level, message, additionalInfo = {}) => {
  const prependObj = {};
  winston[level](
    `${prependObj.hasReqId ? `[Req ID: ${req.reqId}]` : ''}`
      + `${
        prependObj.hasEmployeeId ? ` [Employee ID: ${req.employee._id}]` : ''
      }`
      + `${
        prependObj.hasEmployeeEmail ? ` [Email: ${req.employee.email}]` : ''
      }`
      + ` ${message}`,
  );
};

/**
 * Helper function to upload excel file.
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 */
const uploadExcelFile = async (req, res, next) => {
  winstonLog(req, constants.logLevel.info, `Saving excel file on the server: ${req.files.excelFile.name}`);

  const uploadPath = `${req.files.excelFile.tempFilePath}`;
  // Use the mv() method to place the file in root directory on server
  req.files.excelFile.mv(uploadPath, (err) => {
    if (err) {
      winstonLog(req, constants.logLevel.error, `Failed to save excel file on the server: ${req.files.excelFile.name} Error: ${err}`);
      return next({ msgCode: '2003' });
    }
    winstonLog(req, constants.logLevel.info, `Excel file ${req.files.excelFile.name} saved successfully on the server`);
    return next();
  });
};

/**
 * Helper function to delete excel file.
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 */
const deleteExcelFile = async (req, res, next) => {
  winstonLog(req, constants.logLevel.info, `Deleting excel file from the server: ${req.files.excelFile.name}`);
  fs.unlink(`${req.files.excelFile.tempFilePath}`, (err) => {
    if (err) {
      winstonLog(req, constants.logLevel.error, `Failed to delete excel file from the server: ${req.files.excelFile.name} Error: ${err}`);
      next({ msgCode: '2004' });
    }
    winstonLog(req, constants.logLevel.info, `Excel file ${req.files.excelFile.name} has been deleted successfully from the server`);
  });
};

/**
 * Function to create directory
 */
const createDirectory = async (req, res, next) => {
  winstonLog(req, constants.logLevel.info, `Creating directory: ${req.files.excelFile.tempFilePath}`);
  fs.access(req.files.excelFile.tempFilePath, (error) => {
    if (error) {
      fs.mkdir(req.files.excelFile.tempFilePath, (err) => {
        if (err) {
          winstonLog(req, constants.logLevel.error, `Failed to create directory: ${req.files.excelFile.tempFilePath} Error: ${err}`);
          next({ msgCode: '2008' });
        }
        winstonLog(req, constants.logLevel.info, `Successfully created directory: ${req.files.excelFile.tempFilePath}`);
      });
    } else {
      winstonLog(req, constants.logLevel.info, `Directory already exist: ${req.files.excelFile.tempFilePath}`);
    }
  });
  return next();
};

/**
   * Utility function to validate given email according to regex.
   * @param email
   * @return boolean
   */
const emailValidator = (email) => {
  const userEmailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))/;
  const emailDomainRegex = /((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const emailRegex = new RegExp(`${userEmailRegex.source}@${emailDomainRegex.source}`);
  return emailRegex.test(email);
};

/**
 * Utility function to validate given url according to regex.
 * @param {String} url
 * @returns boolean
 */
const urlValidator = (url) => {
  const urlRegex = new RegExp(`${constants.regex.urlRegex}`);
  return urlRegex.test(url);
};

module.exports = {
  winstonLog,
  uploadExcelFile,
  deleteExcelFile,
  createDirectory,
  emailValidator,
  urlValidator,
};
