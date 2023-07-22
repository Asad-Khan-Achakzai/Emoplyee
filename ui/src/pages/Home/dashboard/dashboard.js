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
import React from 'react';
import { useState, useEffect, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';

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
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  ThemeProvider,
  outlinedInputClasses,
  inputLabelClasses,
  styled,
  IconButton,
  Snackbar,
  Menu,
  MenuItem,
  Fade,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';

// Styling imports
import '../../Login/login.css';

// Constant imports
import { constants } from '../../../constants/constants';
import {
  themeConstants,
  DashboardMainGrid,
  DescriptionGrid,
  StyledSelect,
  TitleGrid,
  ButtonGrid,
  InvitationButton,
  EmployeeBox,
  DashboardDivider,
  HeadingGrid,
  EmployeesListGridStyle,
  DashboardListStyle,
  EmployeeInviteGridStyle,
  DashBoardBoxStyel,
  StyledCrossIcon,
  DescriptionTypography,
  StyledListItemText,
  GridOfLoader,
  ParentGridOfLoader,
  StyledCircularProgress,
  IconButtonGrid,
  StyledAddIcon,
  StyledListItem,
  StyledDeleteIcon,
  StyledEditIcon,
  StyledMoreVertIcon,
  NoDataContainer,
  EmailHelperText,
  EmployeeInviteSubGridStyle,
  StyledRoleText,
  DashboardCardDivider,
} from '../../../constants/theme-constants';
import { colorConstants } from '../../../constants/color-constants';
import { gridSpacing } from '../../../constants/constants';

// Component imports
import theme from '../../../config/theme';
import { RemoveEmployee } from '../../../components/dialogBox/removeEmployeeFromProject';
import { RemoveProject } from '../../../components/dialogBox/removeProject';
import { NoDataFound } from './noDataFound';
import AddProject from '../../../components/dialogBox/addProject';

// Third Party imports
import Select from 'react-select';

// Service import
import {
  getSelectedProject,
  updateMemberRole,
  removeMemberFromProject,
  saveProjectObject,
  deleteProjectWithProjectId,
  sendInvitation,
  updateProject,
} from '../../../services/dashboard.service';

// Redux imports
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../../../store';
import { useSelector } from 'react-redux';

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});
/**
 * Function to render customized text field
 * @param {TextField} TextField
 */
const InvitationTextField = styled(TextField)({
  marginTop: '0.4rem',
  width: '20rem',
  '@media only screen and (max-width: 500px)': {
    width: '13rem',
  },
  [`& .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline}`]: {
    borderColor: colorConstants.labelsColor,
  },
  [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
    {
      borderColor: colorConstants.labelsColor,
    },
  [`& .${outlinedInputClasses.input}`]: {
    color: colorConstants.labelsColor,
  },
  [`&:hover .${outlinedInputClasses.input}`]: {
    color: colorConstants.labelsColor,
  },
  [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.input}`]:
    {
      color: colorConstants.labelsColor,
    },
  [`& .${inputLabelClasses.outlined}`]: {
    color: colorConstants.labelsColor,
  },
  [`&:hover .${inputLabelClasses.outlined}`]: {
    color: colorConstants.labelsColor,
  },
  [`& .${inputLabelClasses.outlined}.${inputLabelClasses.focused}`]: {
    color: colorConstants.labelsColor,
  },
});

/**
 * Renders dashboard screen where user can select any project and view its details
 */
export const DashboardScreen = () => {
  const [invitationEmail, setInvitationEmail] = useState();
  const [openAddProject, setOpenAddProject] = useState(false);
  const [checked, setChecked] = React.useState([1]);
  const [projectsList, setProjectsList] = React.useState(
    JSON.parse(localStorage.getItem(constants.localStorageIdentifiers.projects))
  );
  const [selectedProject, setSelectedProject] = React.useState();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openRemoveDialogForProject, setOpenRemoveDialogForProject] =
    useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState({});
  const [showControls, setShowControls] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState();
  const [severity, setSeverity] = useState('success');
  const [addUpdate, setAddUpdate] = useState(constants.labels.add);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openProjectControls = Boolean(anchorEl);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const existingSelectedProject = useSelector((state) => state.selectedProject);
  const dispatch = useDispatch();
  const { saveProjectName } = bindActionCreators(actionCreators, dispatch);
  const { saveSelectedProject } = bindActionCreators(actionCreators, dispatch);
  const [invitationUserType, setInvitationUserType] = useState(
    constants.dropDowns.userRoles[0].value
  );
  const [restrictCancel, setRestrictCancel] = useState(false);
  useEffect(() => {
    if (existingSelectedProject) {
      setSelectedProject(existingSelectedProject);
      if (
        localStorage.getItem(constants.localStorageIdentifiers.userType) ===
        constants.labels.notAdmin
      ) {
        const project = projectsList.find(
          (project) => project.project_id === existingSelectedProject._id
        );
        setShowControls(
          project && project?.role === constants.dropDowns.userRoles[1].value
        );
      } else {
        setShowControls(true);
      }
    } else if (projectsList[0]?.project_id && projectsList[0]?.project_name) {
      setLoading(true);
      getProjectDetails(projectsList[0]?.project_id);
      saveProjectName(projectsList[0]?.project_name);
      localStorage.setItem(
        constants.localStorageIdentifiers.projectName,
        projectsList[0]?.project_name
      );
    }
    if (
      !projectsList.length &&
      localStorage.getItem(constants.localStorageIdentifiers.userType) ===
        constants.labels.admin
    ) {
      setAddUpdate(constants.labels.add);
      setOpenAddProject(true);
      setRestrictCancel(true);
    }
  }, []);

  useEffect(() => {
    if (selectedProject) {
      // sorting members to bring the pending users on top of the list
      if (selectedProject?.project_members?.length) {
        const sorted = selectedProject?.project_members.sort(
          (memberA, memberB) => (memberB?.project_in[0]?.status === 1 ? -1 : 1)
        );
      }

      saveSelectedProject(selectedProject);
    }
  }, [selectedProject]);
  /**
   * Opens the control menu of the project
   * @param {Event} event
   */
  const openProjectControlsMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Closes the control menu of the project
   */
  const closeProjectControlsMenu = () => {
    setAnchorEl(null);
  };

  /**
   * Function to get project details
   * @param {String} projectId
   */
  const getProjectDetails = (projectId) => {
    if (
      localStorage.getItem(constants.localStorageIdentifiers.userType) ===
      constants.labels.notAdmin
    ) {
      const project = projectsList.find(
        (project) => project.project_id === projectId
      );
      setShowControls(
        project && project?.role === constants.dropDowns.userRoles[1].value
      );
    } else {
      setShowControls(true);
    }
    setLoading(true);
    getSelectedProject(projectId).then((response) => {
      if (constants.statusCode.statusSuccess === response.status) {
        setSelectedProject(response.data.data);
        localStorage.setItem(
          constants.localStorageIdentifiers.projectId,
          projectId
        );
      } else {
        setSeverity(constants.severities.error);
        setSnackBarMessage(constants.toastMessages.FetchprojectDetailsError);
        setSelectedProject({});
        localStorage.setItem(constants.localStorageIdentifiers.projectId, null);
        setOpenSnackbar(true);
      }
      setLoading(false);
    });
  };

  /**
   * Function to handle project change
   * @param {String} projectId
   */
  const handleProjectChange = (projectId) => {
    getProjectDetails(projectId);
    let project = projectsList.find(
      (project) => project.project_id === projectId
    );
    saveProjectName(project?.project_name);
    localStorage.setItem(
      constants.localStorageIdentifiers.projectName,
      project?.project_name
    );
  };

  /**
   * Function to remove employee from the project
   * @param {Event} event
   * @param {String} employee
   */
  const removeEmployeeFromCurrentProject = (event, employee) => {
    setSelectedEmployee(employee);
    setOpen(true);
  };

  /**
   * Function to handle employee role change
   * @param {String} role
   * @param {String} employeeId
   */
  const handleemployeeRoleChange = (role, employeeId, projectId) => {
    updateMemberRole(role, employeeId, projectId).then((response) => {
      if (response.data.success) {
        // Updating selected project object
        const index = selectedProject.project_members.findIndex(
          (employee) => employee._id === employeeId
        );
        let project = JSON.parse(JSON.stringify(selectedProject));
        project.project_members[index].project_in[0].role = role;
        setSelectedProject(project);
        setSeverity(constants.severities.success);
        setSnackBarMessage('');

        setSnackBarMessage(constants.toastMessages.updateMemberRoleSuccess);
      } else {
        setSeverity(constants.severities.error);
        setSnackBarMessage(constants.toastMessages.updateMemberRoleError);
      }
      setOpenSnackbar(true);
    });
  };

  /**
   * Function to remove employee
   * @param {String} employeeId
   */
  const removeEmployee = (employeeId) => {
    removeMemberFromProject(employeeId, selectedProject._id).then(
      (response) => {
        if (response.data.success) {
          // Updating selected project object
          const index = selectedProject.project_members.findIndex(
            (employee) => employee._id === employeeId
          );
          let project = JSON.parse(JSON.stringify(selectedProject));
          project.project_members.splice(index, 1);
          setSelectedProject(project);
          setSeverity(constants.severities.success);
          setSnackBarMessage(constants.toastMessages.removeMemberRoleSuccess);
        } else {
          setSeverity(constants.severities.error);
          setSnackBarMessage(constants.toastMessages.removeMemberRoleError);
        }
        setOpenSnackbar(true);
      }
    );
  };
  /**
   * Function to save project
   * @param {Object} project
   */
  const saveProject = (project) => {
    setIsSubmittingForm(true);
    if (addUpdate === constants.labels.add) {
      saveProjectObject(project).then((response) => {
        setIsSubmittingForm(false);
        if (response?.data?.success) {
          // Adding newly added project to the list
          let projects = JSON.parse(JSON.stringify(projectsList));
          let newProject = {
            project_id: response?.data?.data._id,
            project_name: response?.data?.data.name,
          };
          projects.push(newProject);
          localStorage.setItem(
            constants.localStorageIdentifiers.projects,
            JSON.stringify(projects)
          );
          setProjectsList(projects);
          setOpenAddProject(false);
          setRestrictCancel(false);
          setSeverity(constants.severities.success);
          setSnackBarMessage(constants.toastMessages.addProjectSuccess);
        } else {
          // Checking if there is any duplicate key error
          setSeverity(constants.severities.error);
          response?.response?.data?.data?.keyValue
            ? setSnackBarMessage(
                Object.keys(response.response.data.data.keyValue)[0] +
                  constants.toastMessages.addProjectErrorUniqueKey
              )
            : setSnackBarMessage(constants.toastMessages.addProjectError);
        }
        setOpenSnackbar(true);
      });
    } else {
      updateProject(selectedProject._id, project).then((response) => {
        setIsSubmittingForm(false);
        if (response?.data?.success) {
          // Replacing the updated project in the list
          let projects = JSON.parse(JSON.stringify(projectsList));
          const index = projectsList.findIndex(
            (project) => project._id === selectedProject._id
          );
          let updatedProject = {
            project_id: response?.data?.data._id,
            project_name: response?.data?.data.name,
          };
          projects[index] = updatedProject;
          localStorage.setItem(
            constants.localStorageIdentifiers.projects,
            JSON.stringify(projects)
          );
          setSelectedProject(response?.data?.data);
          setProjectsList(projects);
          setOpenAddProject(false);
          setSeverity(constants.severities.success);
          setSnackBarMessage(constants.toastMessages.updateProjectSuccess);
        } else {
          setSeverity(constants.severities.error);
          response?.response?.data?.data?.keyValue
            ? setSnackBarMessage(
                Object.keys(response.response.data.data.keyValue)[0] +
                  constants.toastMessages.addProjectErrorUniqueKey
              )
            : setSnackBarMessage(constants.toastMessages.updateProjectError);
        }
        setOpenSnackbar(true);
      });
    }
  };
  /**
   * Function to Navigate to project detail
   * @param {String} project
   */
  const navigateToProjectDetail = (project) => {
    navigate(constants.routes.home);
  };

  /**
   * Function to open add project model
   */
  const openAddProjectModelToAdd = () => {
    setAnchorEl(null);
    setAddUpdate(constants.labels.add);
    setOpenAddProject(true);
  };

  /**
   * Function to open add project model
   */
  const openAddProjectModelToUpdate = () => {
    setAnchorEl(null);
    setAddUpdate(constants.labels.update);
    setOpenAddProject(true);
  };

  /**
   * Function to delete project
   */
  const deleteProject = (projectId) => {
    setAnchorEl(null);
    setOpenRemoveDialogForProject(true);
  };

  /**
   * Function to delete project
   */
  const removeProject = (projectId) => {
    setLoading(true);
    deleteProjectWithProjectId(projectId).then((response) => {
      if (response.data.success) {
        let projects = JSON.parse(JSON.stringify(projectsList));
        const index = projectsList.findIndex(
          (project) => project.project_id === projectId
        );
        if (index) {
          projects.splice(index, 1);
          setProjectsList(projects);
          localStorage.setItem(
            constants.localStorageIdentifiers.projects,
            JSON.stringify(projects)
          );
          if (projects.length > 0) {
            setSelectedProject(projects[0]);
            getProjectDetails(projects[0]?.project_id);
          }
        } else {
          setSeverity(constants.severities.error);
          setSnackBarMessage(constants.toastMessages.deleteProjectError);
        }
        setSeverity(constants.severities.success);
        setSnackBarMessage(constants.toastMessages.deleteProjectSuccess);
      } else {
        setSeverity(constants.severities.error);
        setSnackBarMessage(constants.toastMessages.deleteProjectError);
      }
      setOpenSnackbar(true);
      setLoading(false);
    });
  };
  /**
   * Function to close snackbar
   */
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  /**
   * Function to verify email
   */
  const verifyEmail = () => {
    return invitationEmail
      ?.toLowerCase()
      .match(constants.regex.emailValidation);
  };

  /**
   * Function to send email to the member
   */
  const sendInvitationEmail = () => {
    // If member does not exist in the current project
    if (
      !selectedProject.project_members.some(
        (member) => member.email === invitationEmail
      )
    ) {
      setIsInviting(true);
      // If invitationUserType is 'Admin' than send the role as 'User' and type as 'Admin' else don't return type
      const invitationObject = {
        email: invitationEmail,
        projectID: selectedProject?._id,
        projectName: selectedProject?.name,
        role:
          invitationUserType !== constants.dropDowns.userTypes[0].value
            ? invitationUserType
            : constants.dropDowns.userRoles[0].value,
      };
      sendInvitation(
        invitationUserType !== constants.dropDowns.userTypes[0].value
          ? invitationObject
          : {
              ...invitationObject,
              type: constants.dropDowns.userTypes[0].value,
            }
      ).then((response) => {
        setIsInviting(false);
        if (response.data.success) {
          // Updating selected project object
          let project = JSON.parse(JSON.stringify(selectedProject));
          project.project_members.push(response?.data?.data);
          setSelectedProject(project);
          setSeverity(constants.severities.success);
          setSnackBarMessage(constants.toastMessages.sendEmailSuccess);
          setInvitationEmail('');
        } else {
          setSeverity(constants.severities.error);
          setSnackBarMessage(constants.toastMessages.sendEmailError);
        }
        setOpenSnackbar(true);
      });
    } else {
      setSeverity(constants.severities.error);
      setSnackBarMessage(constants.toastMessages.memberAlreadyExistsError);
      setOpenSnackbar(true);
    }
  };
  return (
    <ThemeProvider theme={theme}>
      {isLoading === true ? (
        <ParentGridOfLoader container>
          <GridOfLoader item xs={12} md={8}>
            <StyledCircularProgress disableShrink />
          </GridOfLoader>
        </ParentGridOfLoader>
      ) : (
        <>
          {projectsList.length ||
          localStorage.getItem(constants.localStorageIdentifiers.userType) ===
            constants.labels.admin ? (
            <DashboardMainGrid container component='main'>
              <CssBaseline />
              <DescriptionGrid item xs={12} sm={12} md={4}>
                <Grid display='flex' justifyContent='center'>
                  <Grid md={11} sm={11} xs={11}>
                    <StyledSelect
                      placeholder='Project'
                      menuPlacement='auto'
                      menuPosition='fixed'
                      styles={themeConstants.dashboardProjectsDropdown}
                      value={{
                        value: selectedProject?._id,
                        label: selectedProject?.name,
                      }}
                      options={projectsList
                        .filter((project) => {
                          return project.project_id !== selectedProject?._id;
                        })
                        .map((project) => {
                          return {
                            value: project.project_id,
                            label: project.project_name,
                          };
                        })}
                      onChange={(e) => {
                        handleProjectChange(e.value);
                      }}
                    />
                  </Grid>
                  {localStorage.getItem(
                    constants.localStorageIdentifiers.userType
                  ) === constants.labels.admin ? (
                    <>
                      <IconButtonGrid md={1} sm={1} xs={1}>
                        <IconButton onClick={openProjectControlsMenu}>
                          <StyledMoreVertIcon />
                        </IconButton>
                      </IconButtonGrid>
                      <Menu
                        id='fade-menu'
                        MenuListProps={{
                          'aria-labelledby': 'fade-button',
                        }}
                        anchorEl={anchorEl}
                        open={openProjectControls}
                        onClose={closeProjectControlsMenu}
                        TransitionComponent={Fade}
                      >
                        <MenuItem
                          onClick={(e) => {
                            openAddProjectModelToAdd();
                          }}
                        >
                          <StyledAddIcon />
                          Add
                        </MenuItem>
                        <MenuItem
                          onClick={(e) => {
                            openAddProjectModelToUpdate();
                          }}
                        >
                          <StyledEditIcon />
                          Edit
                        </MenuItem>
                        <MenuItem
                          onClick={(e) => {
                            deleteProject(selectedProject._id);
                          }}
                        >
                          <StyledDeleteIcon />
                          Delete
                        </MenuItem>
                      </Menu>
                    </>
                  ) : null}
                </Grid>

                <TitleGrid>
                  <Typography
                    component='Subtitle1'
                    variant='subtitle1'
                    color={colorConstants.labelsColor}
                  >
                    {selectedProject?.name}
                  </Typography>
                </TitleGrid>
                <Grid>
                  <DescriptionTypography>
                    {selectedProject?.description}
                  </DescriptionTypography>
                </Grid>
                <ButtonGrid>
                  <InvitationButton
                    disabled={!selectedProject}
                    variant='outlined'
                    onClick={(e) => {
                      navigateToProjectDetail(e.value);
                    }}
                  >
                    View Statistics
                  </InvitationButton>
                </ButtonGrid>
              </DescriptionGrid>
              <Grid
                item
                xs={12}
                sm={12}
                md={8}
                component={Paper}
                elevation={6}
                square
                backgroundColor={colorConstants.heimdallPrimaryColor}
              >
                <EmployeeBox>
                  <ThemeProvider theme={theme}>
                    <HeadingGrid>
                      <Typography
                        component='h1'
                        variant='h2'
                        color={colorConstants.labelsColor}
                      >
                        Members
                      </Typography>
                    </HeadingGrid>
                    <DashboardDivider />
                    <EmployeesListGridStyle>
                      <DashboardListStyle dense>
                        {selectedProject?.project_members?.map((employee) => {
                          return (
                            <StyledListItem key={employee}>
                              <ListItemButton
                                disableRipple
                                sx={{
                                  backgroundColor:
                                    localStorage.getItem(
                                      constants.localStorageIdentifiers
                                        .loggedInUserId
                                    ) === employee._id
                                      ? colorConstants.chartPrimaryColor
                                      : null,
                                  '&.MuiButtonBase-root:hover': {
                                    backgroundColor:
                                      localStorage.getItem(
                                        constants.localStorageIdentifiers
                                          .loggedInUserId
                                      ) === employee._id
                                        ? colorConstants.chartPrimaryColor
                                        : null,
                                  },
                                }}
                              >
                                <Grid
                                  item
                                  md={6}
                                  sm={6}
                                  xs={6}
                                  lg={6}
                                  sx={{ display: 'flex', alignItems: 'center' }}
                                >
                                  <ListItemAvatar>
                                    <Avatar
                                      src={
                                        employee.picture
                                          ? employee.picture
                                          : constants.images.memberDefaultImage
                                      }
                                      referrerpolicy='no-referrer'
                                    />
                                  </ListItemAvatar>
                                  <StyledListItemText
                                    primary={
                                      employee.name
                                        ? employee?.name
                                        : employee?.email // Invited users name property does not exist so instead showing their email
                                    }
                                  />
                                </Grid>
                                <Grid
                                  md={6}
                                  sm={6}
                                  xs={6}
                                  lg={6}
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'end',
                                    alignItems: 'center',
                                  }}
                                >
                                  {showControls &&
                                  (localStorage.getItem(
                                    constants.localStorageIdentifiers
                                      .loggedInUserId
                                  ) !== employee._id ||
                                    localStorage.getItem(
                                      constants.localStorageIdentifiers.userType
                                    ) === constants.labels.admin) ? (
                                    <Select
                                      className='userRole'
                                      placeholder='Role'
                                      isDisabled={!showControls}
                                      styles={
                                        themeConstants.customStylesOfMemberRole
                                      }
                                      menuPlacement='auto'
                                      menuPosition='fixed'
                                      value={constants.dropDowns.userRoles.find(
                                        (role) =>
                                          role.value ===
                                          employee.project_in[0]?.role
                                      )}
                                      options={constants.dropDowns.userRoles.filter(
                                        (role) => {
                                          return (
                                            role.value !==
                                            employee.project_in[0]?.role
                                          );
                                        }
                                      )}
                                      onChange={(e) => {
                                        handleemployeeRoleChange(
                                          e.value,
                                          employee._id,
                                          selectedProject?._id
                                        );
                                      }}
                                    />
                                  ) : (
                                    <StyledRoleText
                                      primary={employee.project_in[0]?.role}
                                    />
                                  )}

                                  {showControls &&
                                  (localStorage.getItem(
                                    constants.localStorageIdentifiers
                                      .loggedInUserId
                                  ) !== employee._id ||
                                    localStorage.getItem(
                                      constants.localStorageIdentifiers.userType
                                    ) === constants.labels.admin) ? (
                                    <Grid>
                                      <IconButton
                                        disabled={!showControls}
                                        onClick={(e) => {
                                          removeEmployeeFromCurrentProject(
                                            e.value,
                                            employee
                                          );
                                        }}
                                      >
                                        <StyledCrossIcon />
                                      </IconButton>
                                    </Grid>
                                  ) : null}
                                </Grid>
                              </ListItemButton>
                              <DashboardCardDivider />
                            </StyledListItem>
                          );
                        })}
                      </DashboardListStyle>
                      {showControls ? (
                        <EmployeeInviteGridStyle container>
                          <EmployeeInviteSubGridStyle
                            xs={12}
                            sm={8}
                            md={6}
                            item
                          >
                            <InvitationTextField
                              size='small'
                              variant='outlined'
                              label='Email'
                              value={invitationEmail}
                              onChange={(e) => {
                                setInvitationEmail(e.target.value);
                              }}
                              helperText={
                                !verifyEmail() && invitationEmail ? (
                                  <EmailHelperText>
                                    Enter valid email
                                  </EmailHelperText>
                                ) : null
                              }
                            />
                            <Select
                              className='userRole'
                              placeholder='Role'
                              styles={
                                themeConstants.customStylesOfInvitationUserType
                              }
                              value={{
                                label: invitationUserType,
                                value: invitationUserType,
                              }}
                              menuPlacement='auto'
                              menuPosition='fixed'
                              options={[
                                ...constants.dropDowns.userTypes,
                                ...constants.dropDowns.userRoles,
                              ]}
                              onChange={(e) => {
                                setInvitationUserType(e.value);
                              }}
                            ></Select>
                          </EmployeeInviteSubGridStyle>
                          <InvitationButton
                            xs={12}
                            md={6}
                            variant='outlined'
                            disabled={
                              !verifyEmail() ||
                              !invitationUserType ||
                              isInviting
                            }
                            onClick={sendInvitationEmail}
                          >
                            {isInviting ? 'Inviting...' : 'Invite'}
                          </InvitationButton>
                        </EmployeeInviteGridStyle>
                      ) : null}
                    </EmployeesListGridStyle>
                  </ThemeProvider>
                </EmployeeBox>
                <RemoveEmployee
                  open={open}
                  setOpen={setOpen}
                  removeEmployee={removeEmployee}
                  employeeId={selectedEmployee._id}
                  employeeName={
                    selectedEmployee.name
                      ? selectedEmployee?.name
                      : selectedEmployee?.email
                  }
                />
                <AddProject
                  open={openAddProject}
                  setOpen={setOpenAddProject}
                  saveProject={saveProject}
                  project={selectedProject}
                  addUpdateLabel={addUpdate}
                  isSubmitting={isSubmittingForm}
                  restrictCancel={restrictCancel}
                />
                <Snackbar
                  open={openSnackbar}
                  autoHideDuration={constants.toastDuration}
                  onClose={handleCloseSnackbar}
                >
                  <Alert onClose={handleCloseSnackbar} severity={severity}>
                    {snackBarMessage}
                  </Alert>
                </Snackbar>
                <RemoveProject
                  open={openRemoveDialogForProject}
                  setOpen={setOpenRemoveDialogForProject}
                  removeProject={removeProject}
                  projectId={selectedProject?._id}
                  projectName={selectedProject?.name}
                />
              </Grid>
            </DashboardMainGrid>
          ) : (
            <NoDataContainer container>
              <NoDataFound
                primaryText={
                  constants.labels.noProjectFound +
                  localStorage.getItem(
                    constants.localStorageIdentifiers.loggedInUserName
                  )
                }
                secondaryText={constants.labels.noProjectFoundSecondaryText}
              />
            </NoDataContainer>
          )}
        </>
      )}
    </ThemeProvider>
  );
};
