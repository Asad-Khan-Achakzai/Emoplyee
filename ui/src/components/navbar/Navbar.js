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
import React, { useState } from 'react';
import { Link, useMatch } from 'react-router-dom';

// Material imports
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  MenuItem,
  Menu,
  ListItemIcon,
  Button,
  Grid,
  useMediaQuery,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { styled, useTheme } from '@mui/material/styles';
import Breadcrumbs from '@mui/material/Breadcrumbs';

// Constant imports
import { constants } from '../../constants/constants';
import {
  StyledAppBar,
  StyledIconButton,
  AppTitle,
  NavbarBox,
  StyledMuiLink,
  AppName,
  StyledBreadcrumbs,
  UserNameGrid,
  NavbarSelectedProjectGrid,
  StyledUserAvatar,
} from '../../constants/theme-constants';

// redux imports
import { useSelector } from 'react-redux';

/**
 * Funtion to render navbar
 */
export const Navbar = () => {
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('lg'));
  const [anchorEl, setAnchorEl] = useState(null);
  const projectName = useSelector((state) => state.project);
  const homeMatches = useMatch(constants.routes.home);
  /**
   * Function to handle menu
   */
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Function to logout user
   */
  const onLogout = () => {
    localStorage.clear();
    window.location.href = constants.urls.frontendUrl;
  };

  /**
   * Function to close menu
   */
  const closeMenu = () => {
    setAnchorEl(null);
  };

  return (
    <NavbarBox>
      <StyledAppBar enableColorOnDark position='sticky' elevation={0}>
        <Toolbar>
          <Grid container>
            <Grid
              item
              xs={4}
              sm={6}
              md={4}
              lg={4}
              sx={{ display: 'flex', margin: 'auto' }}
            >
              <AppName
                variant='h2'
                component='div'
                sx={{
                  '@media only screen and (max-width: 426px)': {
                    display: homeMatches ? 'none' : 'block',
                  },
                }}
              >
                Heimdall
              </AppName>
              <StyledBreadcrumbs>
                {homeMatches && (
                  <StyledMuiLink
                    component={Link}
                    to={constants.routes.dashboard}
                  >
                    Dashboard
                  </StyledMuiLink>
                )}
                {homeMatches && (
                  <StyledMuiLink component={Link} to={constants.routes.home}>
                    Statistics
                  </StyledMuiLink>
                )}
              </StyledBreadcrumbs>
            </Grid>
            <NavbarSelectedProjectGrid item xs={5} sm={3} md={4} lg={4}>
              {projectName ? (
                <AppTitle variant='h3' component='div'>
                  {projectName} Details
                </AppTitle>
              ) : null}
            </NavbarSelectedProjectGrid>
            <UserNameGrid item xs={3} sm={3} md={4} lg={4}>
              <Typography
                sx={{
                  '@media only screen and (max-width: 426px)': {
                    display: 'none',
                  },
                }}
              >
                {localStorage.getItem(
                  constants.localStorageIdentifiers.loggedInUserName
                )}
              </Typography>
              <StyledUserAvatar
                aria-label='account of current user'
                aria-controls='menu-appbar'
                aria-haspopup='true'
                src={localStorage.getItem(
                  constants.localStorageIdentifiers.userImage
                )}
                onClick={handleMenu}
              />
              <Menu
                id='menu-appbar'
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={closeMenu}
              >
                <MenuItem>
                  <ListItemIcon>
                    <PersonIcon fontSize='small' />
                  </ListItemIcon>
                  {localStorage.getItem(
                    constants.localStorageIdentifiers.loggedInUserName
                  )}
                </MenuItem>
                <MenuItem onClick={onLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize='small' />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </UserNameGrid>
          </Grid>
        </Toolbar>
      </StyledAppBar>
    </NavbarBox>
  );
};
