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

// Router imports
import { Navigate } from 'react-router-dom';

//Constant imports
import { constants } from '../../constants/constants';

/**
 * Provide guards on route
 * @param {{
 *    Component: Component // Component used in the application
 * }}
 * @returns If the token does not exist it is navigated back to login page
 */
export const ProtectedRoute = ({ component: Component }) => {
  const isAuthenticated = localStorage.getItem(
    constants.localStorageIdentifiers.token
  );
  return isAuthenticated ? (
    <Component />
  ) : (
    (window.location.href = constants.urls.frontendUrl)
  );
};

/**
 * Provide guards on route
 * @param {{
 *    Component: Component // Component used in the application
 * }}
 * @returns If the token exists it is navigated back to home page
 */
export const LoginRedirectRoute = ({ component: Component }) => {
  const isAuthenticated = localStorage.getItem(
    constants.localStorageIdentifiers.token
  );
  return isAuthenticated ? (
    (window.location.href = constants.urls.homePageUrl)
  ) : (
    <Component />
  );
};
