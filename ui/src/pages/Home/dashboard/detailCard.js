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

// React imports
import { useState, useRef, useEffect } from 'react';

// Material import
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  CardContent,
  Divider,
  Grid,
  Typography,
  TextField,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AddIcon from '@mui/icons-material/Add';

// Component imports
import MainCard from '../../../ui-component/cards/mainCard';
import SkeletonDetailCard from '../../../ui-component/cards/Skeleton/detailCard';
import { gridSpacing } from '../../../constants/constants';

// Constant imports
import { constants } from '../../../constants/constants';
import {
  PropertyGrid,
  DetailCardDivider,
  DetailCardChildGrid,
  DetailCardGrid,
} from '../../../constants/theme-constants';

// Third party imports
import PropTypes from 'prop-types';
import moment from 'moment';

/**
 * Function to open URL in next tab of the browser
 * @param {String} url
 */
export const openUrl = (url) => {
  window.open(url, '_blank');
};

/**
 * Function to display card on right of the dashboard for the details of the selected bar in the bar chart
 * @param {{
 *    isLoading: Boolean, // Boolean to check loading state
 *    Property: String, // String for chart property name
 *    selectedIndexData: Array, // List to be rendered in detail card
 * }}
 */
const DetailCard = ({
  isLoading,
  property,
  selectedIndexData,
  addNotableComment,
  weekId,
}) => {
  const theme = useTheme();
  const [comment, setComment] = useState();
  let list = useRef(null);

  // Scroll down when ever change is detected in the list
  useEffect(() => {
    list.scrollIntoView({ behavior: 'smooth' });
  }, [selectedIndexData]);

  /**
   * Function to add comment
   */
  const addComment = () => {
    // Saves comment in the format 'comment - by user name on current date'
    addNotableComment(
      comment +
        ' - by ' +
        localStorage.getItem(
          constants.localStorageIdentifiers.loggedInUserName
        ) +
        ' on ' +
        moment().format('DD-MM-YYYY')
    );
    setComment('');
  };

  /**
   * Function to disblay icon button on the textfield in notable comments
   */
  const Addbutton = () => (
    <IconButton disabled={!weekId || !comment} onClick={addComment}>
      <AddIcon />
    </IconButton>
  );
  return (
    <>
      {isLoading ? (
        <SkeletonDetailCard />
      ) : (
        <MainCard content={false}>
          <CardContent>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                <Grid
                  container
                  alignContent='center'
                  justifyContent='space-between'
                >
                  <PropertyGrid item>
                    <Typography variant='h4'>{property}</Typography>
                  </PropertyGrid>
                </Grid>
              </Grid>
              {selectedIndexData?.length > 0 ? (
                <DetailCardGrid
                  item
                  xs={12}
                  maxHeight={
                    !selectedIndexData[0]?.name && !selectedIndexData[0]?.title
                      ? '18.4rem'
                      : '23.3rem'
                  }
                  minHeight={
                    !selectedIndexData[0]?.name && !selectedIndexData[0]?.title
                      ? '18.4rem'
                      : '23.3rem'
                  }
                >
                  {selectedIndexData.map((item) => (
                    <>
                      <DetailCardChildGrid
                        ref={(element) => {
                          list = element;
                        }}
                        container
                        direction='column'
                      >
                        <Grid item>
                          <Grid
                            container
                            alignItems='center'
                            justifyContent='space-between'
                          >
                            {item?.name || item?.title ? (
                              <Grid item md={10} sm={10} xs={10}>
                                <Typography variant='subtitle1' color='inherit'>
                                  {item.name ? item.name : item.title}
                                </Typography>
                              </Grid>
                            ) : (
                              <Grid item md={12} sm={12} xs={12}>
                                <Typography variant='subtitle1' color='inherit'>
                                  {item}
                                </Typography>
                              </Grid>
                            )}
                            {item.url ? (
                              <Grid item md={2} sm={2} xs={2}>
                                <Grid
                                  container
                                  alignItems='center'
                                  justifyContent='space-between'
                                >
                                  <Grid item>
                                    <IconButton
                                      value={item.url}
                                      onClick={() => openUrl(item.url)}
                                    >
                                      <OpenInNewIcon />
                                    </IconButton>
                                  </Grid>
                                </Grid>
                              </Grid>
                            ) : null}
                          </Grid>
                        </Grid>
                        {item?.complexity ? (
                          <Grid item>
                            <Typography>
                              Complexity: {item?.complexity}
                            </Typography>
                          </Grid>
                        ) : null}
                      </DetailCardChildGrid>
                      <DetailCardDivider />
                    </>
                  ))}
                </DetailCardGrid>
              ) : null}
              <Grid item xs={12}>
                {!selectedIndexData[0]?.name && !selectedIndexData[0]?.title ? (
                  <TextField
                    variant='standard'
                    label={'Add Comment'}
                    fullWidth
                    value={comment}
                    helperText={
                      weekId ? ' ' : 'Select Week and Employee to add comment'
                    }
                    disabled={!weekId}
                    onChange={(event) => {
                      setComment(event.target.value);
                    }}
                    InputProps={{
                      endAdornment: <Addbutton />,
                    }}
                  />
                ) : null}
              </Grid>
            </Grid>
          </CardContent>
        </MainCard>
      )}
    </>
  );
};

DetailCard.propTypes = {
  isLoading: PropTypes.bool,
};

export default DetailCard;
