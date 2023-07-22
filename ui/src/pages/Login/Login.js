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
import { useState, forwardRef } from 'react';

// Material imports
import {
  Avatar,
  Button,
  CssBaseline,
  Divider,
  Paper,
  Box,
  Grid,
  Typography,
  Snackbar,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { ThemeProvider } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import GoogleIcon from '@mui/icons-material/Google';

// Constant imports
import { constants } from '../../constants/constants';
import {
  themeConstants,
  LeftChildGrid,
  AvatarBox,
  StyledAvatar,
  GoogleLoginButton,
  LoginScreenMainGrid,
  LogoGrid,
  StyledDivider,
  ButtonBox,
  CustomeImg,
  StyledCircularProgress,
  CircularProgressGrid,
} from '../../constants/theme-constants';
import { colorConstants } from '../../constants/color-constants';

// Component imports
import theme from '../../config/theme';
import { verifyGoogleAccessToken } from '../../services/userStory.service';

// Third party imports
import { GoogleLogin } from 'react-google-login';

/**
 * Function to open google login page
 */
export const handleGoogleLogin = async () => {
  window.location.href =
    constants.urls.baseUrl + constants.apiUrls.googleLoginAPI;
};

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

/**
 * Navigates user to google login page where user can login using there gmail account
 */
export const Login = () => {
  const [isLoading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState();
  const [severity, setSeverity] = useState('error');

  /**
   * Function to capture google's resoponse
   * @param {Object} googleResponse
   */
  const responseGoogle = (googleResponse) => {
    if (googleResponse.accessToken) {
      setLoading(true);
      verifyGoogleAccessToken(googleResponse.accessToken).then((response) => {
        if (response.status === constants.statusCode.statusSuccess) {
          localStorage.setItem(
            constants.localStorageIdentifiers.userImage,
            response?.data?.data?.employee?.picture
          );
          localStorage.setItem(
            constants.localStorageIdentifiers.token,
            response?.data?.data?.token
          );
          localStorage.setItem(
            constants.localStorageIdentifiers.loggedInUserId,
            response?.data?.data?.employee?._id
          );
          localStorage.setItem(
            constants.localStorageIdentifiers.loggedInUserName,
            response?.data?.data?.employee?.name
          );
          if (
            response?.data?.data?.employee?.type &&
            response?.data?.data?.employee?.type === constants.labels.admin
          ) {
            // TODO: WIll replace localstorage with redux-store
            if (
              response?.data?.data?.projects &&
              response?.data?.data?.projects?.length > 0
            ) {
              // Mapper that maps to the required formate
              let projects = response?.data?.data?.projects.map((project) => {
                return {
                  project_id: project.id,
                  project_name: project.name,
                };
              });
              localStorage.setItem(
                constants.localStorageIdentifiers.projects,
                JSON.stringify(projects)
              );
            } else {
              localStorage.setItem(
                constants.localStorageIdentifiers.projects,
                JSON.stringify([])
              );
            }
            localStorage.setItem(
              constants.localStorageIdentifiers.userType,
              response?.data?.data?.employee?.type
            );
          } else {
            if (
              response?.data?.data?.employee?.project_in &&
              response?.data?.data?.employee?.project_in?.length > 0
            ) {
              localStorage.setItem(
                constants.localStorageIdentifiers.projects,
                JSON.stringify(response?.data?.data?.employee?.project_in)
              );
            } else {
              localStorage.setItem(
                constants.localStorageIdentifiers.projects,
                JSON.stringify([])
              );
            }
            localStorage.setItem(
              constants.localStorageIdentifiers.userType,
              constants.labels.notAdmin
            );
          }
          window.location.href = constants.routes.dashboard;
        } else {
          setLoading(false);
          setSnackBarMessage(constants.toastMessages.memberDoesNotExistError);
          setOpenSnackbar(true);
          // TODO: Toast will be added in both success and failure case
        }
      });
    }
  };

  /**
   * Function to close snackbar
   */
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <ThemeProvider theme={theme}>
      {isLoading ? (
        <LoginScreenMainGrid container component='main'>
          <CircularProgressGrid item xs={12} md={12}>
            <StyledCircularProgress disableShrink />
          </CircularProgressGrid>
        </LoginScreenMainGrid>
      ) : (
        <LoginScreenMainGrid container component='main'>
          <CssBaseline />
          <LeftChildGrid item container sm={6} md={8}>
            <LogoGrid item sm={12} md={12} />
            <CustomeImg src={constants.images.xgridLogo} alt='Xgrid Logo' />
          </LeftChildGrid>
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            component={Paper}
            elevation={6}
            square
            backgroundColor={colorConstants.heimdallPrimaryColor}
          >
            <AvatarBox>
              <StyledAvatar>
                <LockOutlinedIcon />
              </StyledAvatar>
              <ThemeProvider theme={theme}>
                <Grid display={'flex'}>
                  <Typography component='h1' variant='h2'>
                    Heimdall
                  </Typography>
                </Grid>
                <StyledDivider variant='middle' />
                <Typography component='Subtitle1' variant='subtitle1'>
                  Sign in and start managing!
                </Typography>
              </ThemeProvider>
              <ButtonBox component='form' noValidate>
                <GoogleLogin
                  clientId={constants.googleClientid}
                  onSuccess={responseGoogle}
                  onFailure={responseGoogle}
                  render={(renderProps) => (
                    <GoogleLoginButton
                      startIcon={<GoogleIcon />}
                      variant='outlined'
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                    >
                      Login with Google
                    </GoogleLoginButton>
                  )}
                />
              </ButtonBox>
            </AvatarBox>
          </Grid>
          <Snackbar
            open={openSnackbar}
            autoHideDuration={constants.toastDuration}
            onClose={handleCloseSnackbar}
          >
            <Alert onClose={handleCloseSnackbar} severity={severity}>
              {snackBarMessage}
            </Alert>
          </Snackbar>
        </LoginScreenMainGrid>
      )}
    </ThemeProvider>
  );
};
