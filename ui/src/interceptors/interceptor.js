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

/**
 *  Function to intercept every request or response that is being sent by the application
 */
export const Interceptor = () => {
  // Request interceptor
  axios.interceptors.request.use(
    (req) => {
      //TODO: Requests headers will be updated
      return req;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  // Response interceptor
  axios.interceptors.response.use(
    (res) => {
      //TODO: Response will be handled
      return res;
    },
    (err) => {
      return Promise.reject(err);
    }
  );
};
