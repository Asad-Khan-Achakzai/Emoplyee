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

// Material imports
import { Card, CardContent, Grid } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

// Component imports
import { gridSpacing } from '../../../constants/constants';

/**
 * Function to render skeleton of bar chart
 */
const BarChart = () => (
  <Card>
    <CardContent>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid
            container
            alignItems='center'
            justifyContent='space-between'
            spacing={gridSpacing}
          >
            <Grid item xs zeroMinWidth>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Skeleton variant='text' />
                </Grid>
                <Grid item xs={12}>
                  <Skeleton variant='rectangular' height={20} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Skeleton variant='rectangular' height={50} width={80} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Skeleton variant='rectangular' height={530} />
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

export default BarChart;
