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
const { createLogger, format, transports } = require('winston');
const path = require('path');
const fs = require('fs');
require('winston-daily-rotate-file');

// App dependencies
const logDirectory = './logs';

// Create log directory if it does not exist.
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const logFile = path.join(logDirectory, 'api-logs');
// Defining custom logging format
const customFormat = format.printf(
  ({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`,
);

// Creating logger object
const logger = createLogger({
  format: format.combine(
    format.colorize(),
    format.label(),
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    customFormat,
  ),
  transports: [
    new transports.Console(),
    new transports.DailyRotateFile({
      filename: `${logFile}-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
    }),
  ],
  level: 'debug',
});

logger.stream = {
  write: (message) => {
    logger.http(message);
  },
};

module.exports = logger;
