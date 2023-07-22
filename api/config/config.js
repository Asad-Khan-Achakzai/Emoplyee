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
const path = require('path');
const mongoose = require('mongoose');
const async = require('async');
const { v4: uuid } = require('uuid');

// App dependencies
const { winstonLog } = require('../modules/common/common');
const constants = require('./constants');

module.exports = (callback) => {
  async.series(
    [
      (envCb) => {
        // Checking required environment variables
        if (
          !process.env.MONGO_DB_ADDRESS ||
          !process.env.MONGO_DB_NAME ||
          !process.env.MONGO_DB_USER ||
          !process.env.MONGO_DB_PASS
        ) {
          winstonLog(
            {},
            constants.logLevel.error,
            'Missing MongoDB credentials in env file.\n Shutting down server.'
          );
          process.exit(1);
        }
        const dbUrl = `mongodb://${process.env.MONGO_DB_ADDRESS}/${process.env.MONGO_DB_NAME}`;
        // Connecting to Database
        mongoose.connect(dbUrl, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        // when successfully connected
        mongoose.connection.on('connected', () => {
          winstonLog(
            {},
            constants.logLevel.info,
            `Mongoose connection open to '${dbUrl}'`
          );
          envCb();
        });
        // if the connection throws an error
        mongoose.connection.on(constants.logLevel.error, (err) => {
          envCb(err);
        });
        // when the connection is disconnected
        mongoose.connection.on('disconnected', () => {
          winstonLog(
            {},
            constants.logLevel.error,
            'Mongoose connection disconnected'
          );
        });
      },
      (modelsCb) => {
        // load all models
        glob('modules/**/*.model.js', (err, files) => {
          if (err) {
            modelsCb(err);
          } else {
            winstonLog({}, constants.logLevel.info, 'Loading models');
            files.forEach((file) => {
              require(path.join(__dirname, '../', file));
              winstonLog({}, constants.logLevel.info, `'${file}' is loaded`);
            });
            modelsCb();
          }
        });
      },
    ],
    (err) => {
      if (err) {
        return callback(err);
      }
      return callback();
    }
  );
};
