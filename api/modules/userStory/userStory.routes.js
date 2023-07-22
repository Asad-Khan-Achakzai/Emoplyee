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

// NPM Imports
const fileUpload = require('express-fileupload');

// App dependencies
const errorMiddleware = require('../common/error-middleware');
const userStoryController = require('./userStory.controller');
const userStoryMiddleware = require('./userStory.middleware');
const common = require('../common/common');
const passport = require('../../config/passport');

const resource = '/userStory';

module.exports = (app) => {
  /**
   * Route to save excel data into database.
   */
  app.post(
    `${resource}/saveData`,
    passport.isAuthenticated,
    fileUpload({ useTempFiles: true, tempFileDir: '/tmp/' }),
    userStoryMiddleware.checkFileExistance,
    errorMiddleware,
    common.createDirectory,
    common.uploadExcelFile,
    userStoryController.saveExcelSheetDataInDB,
  );
};
