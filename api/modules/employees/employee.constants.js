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
  responseMessages: {
    getEmployeePerformance: {
      success: 'Employee performance has been fetched successfully.',
      failure: 'Failed to fetch employee performance.',
    },
    getMonthlySummary: {
      success: 'Monthly summary has been fetched successfully.',
      failure: 'Failed to fetch monthly summary.',
    },
    addNewComment: {
      success: 'New comment has been added successfully.',
      failure: 'Failed to add new comment.',
    },
    updateEmployeeRoleByProjectID: {
      success: 'User role has been updated successfully.',
      failure: 'Failed to update user role.',
    },
  },
  googleAPIsUrl: 'https://www.googleapis.com/oauth2/v1/userinfo?access_token=',
};
