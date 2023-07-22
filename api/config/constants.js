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

module.exports = {
  apiVersion: 'v1.0',
  tokenExpiryTime: '48hr',
  tokenHeaderKey: 'x_auth_token',
  oneOfErrors: 'oneOfErrors',
  invitationSubject: 'Invitation to Heimdall',
  userTypes: {
    user: 'User',
    admin: 'Admin',
  },
  invitationStatus: {
    pending: 0,
    accepted: 1,
  },
  logLevel: {
    info: 'info',
    error: 'error',
    debug: 'debug',
  },
  serverTimeout: 2 * 60 * 1000,
  maxRequestSize: '2mb',
  redirectUrl: '/home/',
  emailInvitationFilename: '/email-invitation.html',
  scopeParams: ['profile', 'email'],
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  excelFileExt: 'xlsx',
  regex: {
    // url: (/\[|\]/g), // to remove [] these brackets from url
    complexity: (/{\d+}/g), // to find any number of digits in title of user story
    brackets: (/\[|\]|\)|\(|,|{|}|-/g), // to remove all "(){}[]" brackets
    text: (/[a-z A-Z]+/g), // to find only text in title
    // to remove extra text from the string e.g given string is "1) test string." result = "test string."
    comment: (/[a-z A-z&,'.-]+[\d]*[a-z A-z&,'.-]+/g),
    year: (/\d{4}/), // to find year in string
    // regex to validate urls e.g http://www.google.com
    urlRegex: "^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:\/?#[\]@!\$&'\(\)\*\+,;=.]+$",
    // removes '/r' from the whole string
    removeSlashR: /\r/g,
  },
  jwtHeaderKey: 'jwt_token',
  jwt: {
    signOptions: {
      expiresIn: '12h',
    },
    unauthorizedErrorCodes: ['TokenExpiredError', 'NotBeforeError'],
    verificationOptions: {
      clockTimestamp: 20 * 60, // 20 minutes (1200 seconds)
      maxAge: '12h',
    },
  },
  userRole: ['Project Manager', 'User'],
};
