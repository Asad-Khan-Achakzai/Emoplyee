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
const path = require('path');

// Constants Import
const constants = require('../../config/constants');

module.exports = {
  checkFileExistance: (req, res, next) => {
    if (req.files) {
      if (!(path.extname(req.files.excelFile.name).slice(1) === constants.excelFileExt)) {
        return next({ msgCode: '2002' });
      }
    } else {
      return next({ msgCode: '2001' });
    }
    return next();
  },
};
