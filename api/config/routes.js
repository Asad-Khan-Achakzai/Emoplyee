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

// NPM module imports
const glob = require('glob');

// App dependencies
const constants = require('./constants');
const { winstonLog } = require('../modules/common/common');

module.exports = (app) => {
  winstonLog({}, constants.logLevel.info, 'Loading routes');
  const routePath = 'modules/**/*.routes.js';
  const version = `/api/${constants.apiVersion}`;
  glob.sync(routePath).forEach((file) => {
    require(`../${file}`)(app, version);
    winstonLog({}, constants.logLevel.info, `'${file}' is loaded`);
  });
};
