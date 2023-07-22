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
const { to } = require('await-to-js');

// App dependencies
const jwt = require('jsonwebtoken');
const { winstonLog } = require('../modules/common/common');

// Constant imports
const constants = require('./constants');

/**
 * Helper method to sign a payload as JWT
 * @param {Object} payload
 * @returns {Promise<*>} // If information is signed successfully it will return token else error
 */
const signJwtToken = (payload) => new Promise((resolve, reject) => {
  jwt.sign(payload, process.env.JWT_SECRET, constants.jwt.signOptions, (err, signedToken) => {
    if (err) return reject(err);
    return resolve(signedToken);
  });
});

/**
 * Helper method to verify and decode JWT token
 * @param {String} token
 * @returns {Promise} // if token is successfully verified it return information else error
 */
const decodeJwtToken = (token) => new Promise((resolve, reject) => {
  jwt.verify(token, process.env.JWT_SECRET, constants.jwt.verificationOptions, (err, decodedToken) => {
    if (err) return reject(err);
    return resolve(decodedToken);
  });
});

/**
 * Function to authenticate if no error is generated in fetching user information
 * @param {Object} req
 * @param {Object} res
 * @returns {callback}
 */
const isAuthenticated = async (req, res, next) => {
  if (req.headers.x_auth_token === process.env.ADMIN_TOKEN) {
    winstonLog({}, constants.logLevel.debug, 'Bypassing authentication via x_auth_token');
    return next();
  }

  // Handle case when JWT token is provided by the clients and verification is required.
  const [decodeErr, decodedPayload] = await to(decodeJwtToken(req.headers[constants.jwtHeaderKey]));
  if (decodeErr) {
    // There are three possible error codes which can be returned by the jwt.verify() function.
    // Ref: https://www.npmjs.com/package/jsonwebtoken#errors--codes

    // Handle auth related error codes
    if (decodeErr.name && constants.jwt.unauthorizedErrorCodes.includes(decodeErr.name)) {
      winstonLog(req, constants.logLevel.error, `Provided JWT token expired. Error: ${decodeErr.message}`);
      return next({ msgCode: '0006', status: 401 });
    }
    // Handle JWT parsing error code
    winstonLog(req, constants.logLevel.error, `Failed to decode JWT token. Error: ${decodeErr.message}`);
    return next({ msgCode: '0005', status: 500 });
  }

  if (!decodedPayload) return next({ msgCode: '0006', status: 401 });
  req.user = decodedPayload;
  return next();
};

module.exports = {
  isAuthenticated,
  signJwtToken,
};
