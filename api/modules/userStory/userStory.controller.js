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

// App dependencies
const { deleteExcelFile } = require('../common/common');
const { winstonLog } = require('../common/common');
const constants = require('../../config/constants');
const userStoriesHelper = require('./userStory.helper');
const { responseMessages } = require('./userStory.constants');

/**
 * Upload data from excel sheet to DB
 * @param {Object} req
 * @param {Object} res
 * @returns {callback}
 */
const saveExcelSheetDataInDB = async (req, res, next) => {
  winstonLog(req, constants.logLevel.info, `Saving excel sheet data in the database: ${req.files.excelFile.name}`);
  const [uploadDataError, uploadData] = await to(userStoriesHelper.saveExcelSheetDataInDB(req, res, next));
  if (uploadDataError) {
    winstonLog(req, constants.logLevel.error, `Failed to save excel excel sheet data in the database: ${req.files.excelFile.name}`);
    deleteExcelFile(req, res, next); // deleting excel file after successfully upload
    res.status(500);
    return next({ msgCode: '2003' });
  }
  winstonLog(req, constants.logLevel.info, `Excel sheet data has been saved successfully in the database: ${req.files.excelFile.name}`);
  deleteExcelFile(req, res, next); // deleting excel file after successfully upload
  res.status(200);
  return res.json({
    success: 1,
    message: `${responseMessages.saveExcelSheetDataInDB.success}.`,
    data: [],
  });
};

module.exports = {
  saveExcelSheetDataInDB,
};
