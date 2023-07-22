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
 * Funtion to render skeleton for detail card
 */
const DetailCard = () => (
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
              <Skeleton variant='rectangular' height={20} />
            </Grid>
            <Grid item>
              <Skeleton variant='rectangular' height={20} width={20} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Skeleton variant='rectangular' height={150} />
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Grid
                container
                alignItems='center'
                spacing={gridSpacing}
                justifyContent='space-between'
              >
                <Grid item xs={6}>
                  <Skeleton variant='rectangular' height={20} />
                </Grid>
                <Grid item xs={6}>
                  <Grid
                    container
                    alignItems='center'
                    spacing={gridSpacing}
                    justifyContent='space-between'
                  >
                    <Grid item xs zeroMinWidth>
                      <Skeleton variant='rectangular' height={20} />
                    </Grid>
                    <Grid item>
                      <Skeleton variant='rectangular' height={16} width={16} />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Skeleton variant='rectangular' height={20} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Grid
                container
                alignItems='center'
                spacing={gridSpacing}
                justifyContent='space-between'
              >
                <Grid item xs={6}>
                  <Skeleton variant='rectangular' height={20} />
                </Grid>
                <Grid item xs={6}>
                  <Grid
                    container
                    alignItems='center'
                    spacing={gridSpacing}
                    justifyContent='space-between'
                  >
                    <Grid item xs zeroMinWidth>
                      <Skeleton variant='rectangular' height={20} />
                    </Grid>
                    <Grid item>
                      <Skeleton variant='rectangular' height={16} width={16} />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Skeleton variant='rectangular' height={20} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Grid
                container
                alignItems='center'
                spacing={gridSpacing}
                justifyContent='space-between'
              >
                <Grid item xs={6}>
                  <Skeleton variant='rectangular' height={20} />
                </Grid>
                <Grid item xs={6}>
                  <Grid
                    container
                    alignItems='center'
                    spacing={gridSpacing}
                    justifyContent='space-between'
                  >
                    <Grid item xs zeroMinWidth>
                      <Skeleton variant='rectangular' height={20} />
                    </Grid>
                    <Grid item>
                      <Skeleton variant='rectangular' height={16} width={16} />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Skeleton variant='rectangular' height={20} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Grid
                container
                alignItems='center'
                spacing={gridSpacing}
                justifyContent='space-between'
              >
                <Grid item xs={6}>
                  <Skeleton variant='rectangular' height={20} />
                </Grid>
                <Grid item xs={6}>
                  <Grid
                    container
                    alignItems='center'
                    spacing={gridSpacing}
                    justifyContent='space-between'
                  >
                    <Grid item xs zeroMinWidth>
                      <Skeleton variant='rectangular' height={20} />
                    </Grid>
                    <Grid item>
                      <Skeleton variant='rectangular' height={16} width={16} />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Skeleton variant='rectangular' height={20} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Grid
                container
                alignItems='center'
                spacing={gridSpacing}
                justifyContent='space-between'
              >
                <Grid item xs={6}>
                  <Skeleton variant='rectangular' height={20} />
                </Grid>
                <Grid item xs={6}>
                  <Grid
                    container
                    alignItems='center'
                    spacing={gridSpacing}
                    justifyContent='space-between'
                  >
                    <Grid item xs zeroMinWidth>
                      <Skeleton variant='rectangular' height={20} />
                    </Grid>
                    <Grid item>
                      <Skeleton variant='rectangular' height={16} width={16} />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Skeleton variant='rectangular' height={20} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </CardContent>
    <CardContent
      sx={{ p: 1.25, display: 'flex', pt: 0, justifyContent: 'center' }}
    >
      <Skeleton variant='rectangular' height={25} width={75} />
    </CardContent>
  </Card>
);

export default DetailCard;
