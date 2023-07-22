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
// Constant import
import { constants } from '../../constants/constants.js';

/**
 * Function to apply action on the state based on the type
 * @param {String} state
 * @param {Action} action
 */
const reducer = (
  state = localStorage.getItem(constants.localStorageIdentifiers.projectName),
  action
) => {
  switch (action.type) {
    case constants.reduxTypes.saveProjectName:
      return action.payload;
    default:
      return state;
  }
};

export default reducer;
