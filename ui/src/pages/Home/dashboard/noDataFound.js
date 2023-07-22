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

import {
  NoDataFoundGrid,
  StyledErrorIcon,
  NodataFoundText,
  NodataFoundSecondaryText,
} from '../../../constants/theme-constants';

// Material imports
import { Grid } from '@mui/material';

/**
 * Function no data found message
 * @param {{
 *    primaryText: String, // Text that is to be displayed
 *    secondaryText: String, // Text that is to be displayed
 * }}
 */
export const NoDataFound = ({ primaryText, secondaryText }) => {
  return (
    <>
      <NoDataFoundGrid container>
        <Grid>
          <StyledErrorIcon />
          <NodataFoundText>{primaryText}</NodataFoundText>
          <NodataFoundSecondaryText>{secondaryText}</NodataFoundSecondaryText>
        </Grid>
      </NoDataFoundGrid>
    </>
  );
};
