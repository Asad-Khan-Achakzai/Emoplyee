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
 * Function to consutruct api request
 * @param {String} url
 * @param {Array} query
 * @param {Object} body
 * @returns Object of request
 */
const constructAPIRequest = (url, query, body) => {
  const request = {
    url: query
      ? `${constants.urls.baseUrl + url}?${query?.toString()}`
      : constants.urls.baseUrl + url,
    headers: {
      jwt_token: localStorage.getItem(constants.localStorageIdentifiers.token),
    },
  };
  return body ? { ...request, body } : request;
};

/**
 * Get Employee Performance by Month
 * @param {String} employeeId
 * @param {String} monthName
 * @param {String} week
 * @param {String} property
 * @returns List of weeks of the month
 */
export const getEmployeePerformanceByMonth = async (
  employeeID,
  monthName,
  week,
  property
) => {
  const queryParams = new URLSearchParams({
    employeeID: employeeID,
    week: week,
    property: property,
  });
  const request = constructAPIRequest(
    constants.endPoint.weeklyPerformance +
      localStorage.getItem(constants.localStorageIdentifiers.projectId) +
      '/' +
      monthName,
    queryParams
  );
  const [err, result] = await to(
    axios.get(request.url, {
      headers: request.headers,
    })
  );
  if (err) {
    return err;
  } else {
    return result;
  }
};

/**
 * Get Monthly Summary by Month
 * @param {string} monthName
 * @returns List of months
 */
export const getMonthlySummaryByMonth = async (monthName) => {
  const request = constructAPIRequest(
    constants.endPoint.monthlySummary +
      localStorage.getItem(constants.localStorageIdentifiers.projectId) +
      '/' +
      monthName
  );
  const [err, result] = await to(
    axios.get(request.url, { headers: request.headers })
  );
  if (err) {
    return err;
  } else {
    return result;
  }
};

/**
 * Function to add notable comment
 * @param {string} comment
 * @param {string} weekId
 * @returns {Object} Response object that contains status of the comment is added
 */
export const addNotableCommentToDb = async (comment, weekId) => {
  const request = constructAPIRequest(
    constants.endPoint.addNotableComment + weekId,
    [],
    { comment: comment }
  );
  const [err, result] = await to(
    axios.post(request.url, request.body, { headers: request.headers })
  );
  if (err) {
    return err;
  } else {
    return result;
  }
};

/**
 * Function to add verify google access token
 * @param {string} token
 * @returns Object with status code
 */
export const verifyGoogleAccessToken = async (token) => {
  const queryParams = new URLSearchParams({
    token: token,
  });
  const request = constructAPIRequest(
    constants.endPoint.verifyAccessToken,
    queryParams
  );
  const [err, result] = await to(
    axios.get(request.url, { headers: request.headers })
  );
  if (err) {
    return err;
  } else {
    return result;
  }
};

/**
 * Uploads user stories to the database
 * @returns boolean
 */
export const loadUserStories = async () => {
  const request = constructAPIRequest(constants.endPoint.loadUserStories);
  const [err, result] = await to(
    axios.post(request.url, { headers: request.headers })
  );
  if (err) {
    return err;
  } else {
    return true;
  }
};
