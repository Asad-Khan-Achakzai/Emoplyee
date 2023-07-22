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

const express = require('express');
const morgan = require('morgan');
const http = require('http');
const { v4: uuid } = require('uuid');
const constants = require('./config/constants');
const { winstonLog } = require('./modules/common/common');
const winston = require('./config/winston');

// Configuring the environment
require('dotenv').config({
  path: '.env',
});

const app = express();

const port = process.env.SERVER_PORT || 3000;

function shutdown() {
  winstonLog({}, constants.logLevel.info, 'Shutting down server');
  process.exit(1);
}
// Configure routes and error handling
require('./config/config')((err) => {
  if (err) {
    winstonLog(
      {},
      constants.logLevel.error,
      `An error occurred while configuring app: ${err}. Shutting down server.`
    );
    process.exit(1);
  } else {
    app.use(
      express.urlencoded({ extended: true, limit: constants.maxRequestSize })
    );
    app.use(express.json({ limit: constants.maxRequestSize })); // Default max request body size is 100kb

    // CORS middleware
    app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      res.setHeader(
        'Access-Control-Allow-Methods',
        'PUT, POST, GET, DELETE, OPTIONS'
      );
      res.setHeader('Access-Control-Expose-Headers', constants.tokenHeaderKey);
      next();
    });

    // CORS middleware for handling options request
    app.use((req, res, next) => {
      if (req.method === 'OPTIONS') {
        // Generate comma separated list of allowed header keys
        const allowedHeaders = [
          'Content-Type',
          constants.tokenHeaderKey,
          constants.jwtHeaderKey,
        ].join(', ');

        const headers = {};
        headers['Access-Control-Allow-Origin'] = '*';
        headers['Access-Control-Allow-Methods'] =
          'POST, GET, PUT, DELETE, OPTIONS';
        headers['Access-Control-Allow-Headers'] = allowedHeaders;
        headers['Access-Control-Expose-Headers'] = constants.tokenHeaderKey;
        headers['Access-Control-Expose-Headers'] = constants.jwtHeaderKey;
        res.writeHead(200, headers);
        res.end();
      } else {
        next();
      }
    });

    // Configuring the request to append a unique id.
    app.use((req, res, next) => {
      req.reqId = uuid();
      next();
    });

    require('./config/express')(app);

    // Requring after the schemas are loaded
    // App dependencies
    const projectHelper = require('./modules/project/project.helper');

    const onError = (error) => {
      switch (error.code) {
        case 'EACCES':
          winstonLog(
            {},
            constants.logLevel.error,
            `Port '${port}' requires elevated privileges`
          );
          break;
        case 'EADDRINUSE':
          winstonLog(
            {},
            constants.logLevel.error,
            `Port '${port}' is already in use`
          );
          break;
        default:
          winstonLog(
            {},
            constants.logLevel.error,
            `An error occurred while starting server: ${error}`
          );
      }
      shutdown();
    };

    const onListening = () => {
      winstonLog(
        {},
        constants.logLevel.info,
        `Server started on port: '${port}'`
      );
    };

    // Adding member as an admin if it already does not exist
    const employee = projectHelper.addEmployeeAsAnAdmin(
      process.env.EMPLOYEE_EMAIL,
      process.env.EMPLOYEE_NAME
    );

    // Creating server
    const server = http.createServer(app);
    server.listen(port);
    server.setTimeout(constants.serverTimeout);
    server.on('error', onError);
    server.on('listening', onListening);
  }
});
