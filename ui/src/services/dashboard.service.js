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

// Third party imports
import axios from 'axios';
import to from 'await-to-js';

// Constant imports
import { constants } from '../constants/constants.js';

/**
 * Get selected project for the dashboard
 * @param {String} projectId
 * @returns object of the project
 */
export const getSelectedProject = async (projectId) => {
  const url = `${
    constants.urls.baseUrl +
    constants.endPoint.getProject +
    projectId +
    constants.endPoint.details
  }`;
  const headers = {
    jwt_token: localStorage.getItem(constants.localStorageIdentifiers.token),
  };
  const [err, result] = await to(axios.get(url, { headers: headers }));
  if (err) {
    return err;
  } else {
    return result;
  }
};

/**
 * Function to update member role
 * @param {String} role
 * @param {String} employeeId
 * @param {String} projectId
 * @returns object that contains the status
 */
export const updateMemberRole = async (role, employeeId, projectId) => {
  const url = `${
    constants.urls.baseUrl +
    constants.endPoint.employee +
    employeeId +
    constants.endPoint.update +
    projectId
  }`;
  const headers = {
    jwt_token: localStorage.getItem(constants.localStorageIdentifiers.token),
  };
  const [err, result] = await to(
    axios.post(url, { role: role }, { headers: headers })
  );
  if (err) {
    return err;
  } else {
    return result;
  }
};

/**
 * Function to send invitation to user
 * @param {Object} body
 * @returns {Object} Response object that contains status of the invitation that is sent
 */
export const sendInvitation = async (body) => {
  const url = `${
    constants.urls.baseUrl +
    constants.endPoint.getProject +
    constants.endPoint.sendInvitation
  }`;
  const headers = {
    jwt_token: localStorage.getItem(constants.localStorageIdentifiers.token),
  };
  const [err, result] = await to(axios.post(url, body, { headers: headers }));
  if (err) {
    return err;
  } else {
    return result;
  }
};

/**
 * Function to update member role
 * @param {String} employeeId
 * @param {String} projectId
 * @returns object that contains the status
 */
export const removeMemberFromProject = async (employeeId, projectId) => {
  const url = `${
    constants.urls.baseUrl +
    constants.endPoint.employee +
    employeeId +
    constants.endPoint.update +
    projectId
  }`;
  const headers = {
    jwt_token: localStorage.getItem(constants.localStorageIdentifiers.token),
  };
  const [err, result] = await to(
    axios.post(url, { remove: true }, { headers: headers })
  );
  if (err) {
    return err;
  } else {
    return result;
  }
};

/**
 * Function to save project
 * @param {Object} project
 * @returns object that contains the status
 */
export const saveProjectObject = async (project) => {
  const url = `${
    constants.urls.baseUrl +
    constants.endPoint.getProject +
    constants.endPoint.add
  }`;
  const headers = {
    jwt_token: localStorage.getItem(constants.localStorageIdentifiers.token),
  };
  const [err, result] = await to(
    axios.post(url, project, { headers: headers })
  );
  if (err) {
    return err;
  } else {
    return result;
  }
};

/**
 * Function to update project
 * @param {Object} project
 * @returns object that contains the status
 */
export const updateProject = async (projectId, project) => {
  const url = `${
    constants.urls.baseUrl +
    constants.endPoint.getProject +
    projectId +
    constants.endPoint.updateProject
  }`;
  const headers = {
    jwt_token: localStorage.getItem(constants.localStorageIdentifiers.token),
  };
  const [err, result] = await to(axios.put(url, project, { headers: headers }));
  if (err) {
    return err;
  } else {
    return result;
  }
};

/**
 * Function to delete project
 * @param {String} projectId
 * @returns object that contains the status
 */
export const deleteProjectWithProjectId = async (projectId) => {
  const url = `${
    constants.urls.baseUrl +
    constants.endPoint.getProject +
    projectId +
    constants.endPoint.delete
  }`;
  const headers = {
    jwt_token: localStorage.getItem(constants.localStorageIdentifiers.token),
  };
  const [err, result] = await to(axios.delete(url, { headers: headers }));
  if (err) {
    return err;
  } else {
    return result;
  }
};
