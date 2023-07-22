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

// Images imports
import Xgrid from '../assets/xgrid.jpg';
import Logo from '../assets/xgrid-logo-inverted.svg';
import memberDefaultImage from '../assets/defaultImage.png';

// Config import
import configData from '../config/config.json';

// Third Party imports
import moment from 'moment';

export const constants = {
  chartTestKeyValue: 'some property',
  noDataMessage: {
    noData: 'No data found',
    missingEmployee: 'No data found please select Employee',
  },
  statusCode: {
    statusSuccess: 200,
    success: 1,
  },
  localStorageIdentifiers: {
    token: 'token',
    loggedInUserName: 'loggedInUserName',
    loggedInUserId: 'loggedInUserId',
    selectedProject: 'selectedProject',
    userType: 'userType',
    projects: 'projects',
    projectId: 'projectId',
    projectName: 'projectName',
    userImage: 'userImage',
  },
  urls: {
    baseUrl: configData.urls.BASE_URL,
    frontendUrl: configData.urls.FRONTEND_URL,
    homePageUrl: configData.urls.FRONTEND_URL + 'dashboard',
  },
  routes: {
    home: '/home',
    dashboard: '/dashboard',
  },
  chartTypes: {
    barChart: 'bar',
    pieChart: 'pie',
  },
  apiUrls: {
    googleLoginAPI: '/employee/google-login',
  },
  endPoint: {
    loadUserStories: '/user-story/load-story',
    weeklyPerformance: '/employee/performance/',
    monthlySummary: '/employee/summary/',
    getEmployeeData: '/user-story/get-employee-data',
    getEmployeeFromComputational: '/user-story/get-employee-computational',
    addNotableComment: '/employee/week/',
    verifyAccessToken: '/employee/login',
    // TODO: WIll update once the endpoint is provided
    getProject: '/project/',
    details: '/details',
    sendInvitation: 'sendInvitation',
    removeEmployeeFromProject: '',
    employee: '/employee/',
    update: '/update/',
    add: 'add',
    delete: '/delete',
    updateProject: '/update',
  },
  googleClientid: configData.keys.GOOGLE_CLIENT_ID,
  images: {
    xgridImage: Xgrid,
    xgridLogo: Logo,
    memberDefaultImage: memberDefaultImage,
  },
  chartsCategories: {
    employeeChartCategories: [
      'Carry Over Stories',
      'Complexity',
      'PRs Merged',
      'New Stories Assigned',
      'Stories Completed',
      'Story Deficit',
    ],
    monthlySummaryChartCategories: [
      'Time To Resolution Ratio',
      'Epics',
      'Sprint Velocity',
      'Total Story Points',
      'Total PRs Merged',
    ],
  },
  dropDowns: {
    chartTypes: [
      {
        value: 'employeesChart',
        label: 'Employees Chart',
      },
      {
        value: 'propertiesChart',
        label: 'Properties Chart',
      },
      {
        value: 'monthlySummaryChart',
        label: 'Monthly Summary Chart',
      },
      {
        value: 'comparisonChart',
        label: 'Comparison Chart',
      },
    ],
    projectsDummyData: [
      {
        name: 'Project A',
        _id: '123A',
        description:
          "Project A is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s",
        fileurl: 'SomeURL.com',
      },
      {
        name: 'Project B',
        _id: '123B',
        description:
          "Project B is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s",
        fileurl: 'SomeURL.com',
      },
      {
        name: 'Project C',
        _id: '123C',
        description:
          "Project C is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s",
        fileurl: 'SomeURL.com',
      },
      {
        name: 'Project D',
        _id: '123D',
        description:
          "Project D is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
        fileurl: 'SomeURL.com',
      },
    ],
    employeesDummyData: [
      {
        name: 'Employee A',
        role: 'user',
        _id: '123A',
        url: 'https://st4.depositphotos.com/1158045/23593/i/1600/depositphotos_235938982-stock-photo-bright-portrait-senior-business-man.jpg',
      },
      {
        name: 'Employee B',
        _id: '123B',
        role: 'user',
        url: 'https://st3.depositphotos.com/2208684/16919/i/1600/depositphotos_169196486-stock-photo-businessman-standing-in-the-office.jpg',
      },
      {
        name: 'Employee C',
        _id: '123C',
        role: 'user',
        url: 'https://st3.depositphotos.com/4431055/15764/i/1600/depositphotos_157644858-stock-photo-businessman-with-crossed-hands.jpg',
      },
      {
        name: 'Employee D',
        _id: '123D',
        role: 'user',
        url: 'https://st3.depositphotos.com/2208684/33959/i/1600/depositphotos_339590974-stock-photo-close-portrait-senior-businessman-standing.jpg',
      },
      {
        name: 'Employee A',
        _id: '123E',
        role: 'user',
        url: 'https://st4.depositphotos.com/1158045/23593/i/1600/depositphotos_235938982-stock-photo-bright-portrait-senior-business-man.jpg',
      },
      {
        name: 'Employee B',
        _id: '123F',
        role: 'admin',
        url: 'https://st3.depositphotos.com/2208684/16919/i/1600/depositphotos_169196486-stock-photo-businessman-standing-in-the-office.jpg',
      },
      {
        name: 'Employee C',
        _id: '123H',
        role: 'admin',
        url: 'https://st3.depositphotos.com/4431055/15764/i/1600/depositphotos_157644858-stock-photo-businessman-with-crossed-hands.jpg',
      },
      {
        name: 'Employee D',
        _id: '123I',
        role: 'admin',
        url: 'https://st3.depositphotos.com/2208684/33959/i/1600/depositphotos_339590974-stock-photo-close-portrait-senior-businessman-standing.jpg',
      },
      {
        name: 'Employee A',
        _id: '123J',
        role: 'admin',
        url: 'https://st4.depositphotos.com/1158045/23593/i/1600/depositphotos_235938982-stock-photo-bright-portrait-senior-business-man.jpg',
      },
      {
        name: 'Employee B',
        _id: '123K',
        role: 'user',
        url: 'https://st3.depositphotos.com/2208684/16919/i/1600/depositphotos_169196486-stock-photo-businessman-standing-in-the-office.jpg',
      },
      {
        name: 'Employee C',
        _id: '123L',
        role: 'user',
        url: 'https://st3.depositphotos.com/4431055/15764/i/1600/depositphotos_157644858-stock-photo-businessman-with-crossed-hands.jpg',
      },
      {
        name: 'Employee D',
        _id: '123M',
        role: 'user',
        url: 'https://st3.depositphotos.com/2208684/33959/i/1600/depositphotos_339590974-stock-photo-close-portrait-senior-businessman-standing.jpg',
      },
    ],
    loggedInEmployee: {
      _id: 'user001',
      name: 'Aqib Naveed',
      email: 'aqib.naveed@xgrid.co',
      picture:
        'https://lh3.googleusercontent.com/a/AItbvml4JrEvn1BX3khs_vz9gZcP-O2nkeh2-4MuUP8x=s96-c',
      type: 'admin',
      status: 1,
      projectIn: [
        {
          projectId: '001',
          projectName: 'Project A',
          role: 'projectManager',
        },
        {
          projectId: '002',
          projectName: 'Project B',
          role: 'projectManager',
        },
        {
          projectId: '003',
          projectName: 'Project C',
          role: 'projectManager',
        },
      ],
    },
    selectedPrjoect: {
      _id: '001',
      name: 'Heimdall App',
      description:
        'The App will be giving the useful information by displaying the charts of Employee performance, for the provided date range.',
      projectMember: [
        {
          _id: 'user001',
          name: 'Aqib Naveed',
          email: 'aqib.naveed@xgrid.co',
          picture:
            'https://lh3.googleusercontent.com/a/AItbvml4JrEvn1BX3khs_vz9gZcP-O2nkeh2-4MuUP8x=s96-c',
          type: 'admin',
          status: 1,
          projectRole: '',
          projectIn: [
            {
              projectId: '001',
              projectName: 'Heimdall App',
              role: 'projectManager',
            },
          ],
        },
        {
          _id: 'user002',
          name: 'Asad Khan',
          email: 'asad.khan@xgrid.co',
          picture:
            'https://d1muf25xaso8hp.cloudfront.net/https%3A%2F%2Fs3.amazonaws.com%2Fappforest_uf%2Ff1512936020165x278911292087286720%2FA.png?w=&h=&auto=compress&dpr=1&fit=max',
          status: 0,
          projectIn: [
            {
              projectId: '001',
              projectName: 'Heimdall App',
              role: 'user',
            },
          ],
        },
        {
          _id: 'user003',
          name: 'Fahad Jalal',
          email: 'fahad.jalal@xgrid.co',
          picture:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Eo_circle_pink_letter-f.svg/1024px-Eo_circle_pink_letter-f.svg.png',
          status: 1,
          projectIn: [
            {
              projectId: '001',
              projectName: 'Heimdall App',
              role: 'projectManager',
            },
            {
              projectId: '003',
              projectName: 'USIS',
              role: 'user',
            },
          ],
        },
      ],
    },

    userRoles: [
      {
        value: 'User',
        label: 'User',
      },
      {
        value: 'Project Manager',
        label: 'Project Manager',
      },
    ],
    userTypes: [
      {
        value: 'Admin',
        label: 'Admin',
      },
    ],
    properties: [
      {
        value: 'carryover_stories',
        label: 'Carry Over Stories',
      },
      {
        value: 'complexity',
        label: 'Complexity',
      },
      {
        value: 'prs_merged',
        label: 'PRs Merged',
      },
      {
        value: 'new_stories_assigned',
        label: 'New Stories Assigned',
      },
      {
        value: 'stories_completed',
        label: 'Stories Completed',
      },
      {
        value: 'story_deficit',
        label: 'Story Deficit',
      },
      {
        value: 'notable_comments',
        label: 'Notable Comments',
      },
    ],
  },
  months: [
    { value: 'Jan', label: 'January' },
    { value: 'Feb', label: 'February' },
    { value: 'Mar', label: 'March' },
    { value: 'Apr', label: 'April' },
    { value: 'May', label: 'May' },
    { value: 'Jun', label: 'June' },
    { value: 'Jul', label: 'July' },
    { value: 'Aug', label: 'August' },
    { value: 'Sep', label: 'September' },
    { value: 'Oct', label: 'October' },
    { value: 'Nov', label: 'November' },
    { value: 'Dec', label: 'December' },
  ],
  toastMessages: {
    weekDataSuccessMessage: 'Week data fetched successfully',
    monthlySummarySuccessMessage: 'Monthly Summary data fetched successfully',
    saveNotableCommentSuccessMessage: 'Saved comment successfully',
    saveNotableCommentErrorMessage: 'Could not save comment',
    weekDataErrorMessage: 'Week data could not be fetched',
    monthlySummaryErrorMessage: 'Monthly Summary data could not be fetched',
    weekDataNoDataFoundMessage: 'No data found for this year',
    monthlyNoDataFoundErrorMessage: 'No data found',
    FetchprojectDetailsSuccess: 'Project Detail fetched successfully',
    FetchprojectDetailsError: 'Project Detail could not be fetched',
    updateMemberRoleSuccess: 'Member role updated successfully',
    updateMemberRoleError: 'Member role could not be updated',
    removeMemberRoleSuccess: 'Removed member successfully',
    removeMemberRoleError: 'Member could bot be removed',
    addProjectSuccess: 'Added project successfully',
    addProjectError: 'Project could not be added',
    addProjectErrorUniqueKey: ' already exists', // Space given intentialy
    deleteProjectSuccess: 'Project deleted successfully',
    deleteProjectError: 'Project could not be deleted',
    sendEmailSuccess: 'Email sent successfully',
    sendEmailError: 'Email could not be sent',
    memberAlreadyExistsError: 'Member already exists in this project',
    updateProjectSuccess: 'Updated project successfully',
    updateProjectError: 'Project could not be updated',
    memberDoesNotExistError: 'Member does not exist',
  },
  severities: {
    success: 'success',
    info: 'info',
    warning: 'warning',
    error: 'error',
  },
  labels: {
    chartSummaryLabelForEmployee1: 'Employee 1',
    chartSummaryLabelForEmployee2: 'Employee 2',
    notableComments: 'Notable Comments',
    allWeeks: 'All weeks',
    notAdmin: 'Not Admin',
    admin: 'Admin',
    add: 'Add',
    update: 'Update',
    projectNameHelperText: 'Enter your project name',
    projectNameRequired: 'Project name is required',
    fileUrlHelperText: 'Enter file URL',
    fileUrlRequired: 'File URL is required',
    descriptionHelperText: 'Enter Description',
    descriptionRequired: 'Description is required',
    noDataFoundForTheYear:
      'No data found for the year ' + moment().format('YYYY'),
    noProjectFound: 'No project found for the user: ',
    noProjectFoundSecondaryText: 'Please contact Admin!',
  },
  reduxTypes: {
    saveProjectName: 'saveProjectName',
    saveSelectedProject: 'saveSelectedProject',
  },
  regex: {
    emailValidation: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, // Validates if email is valid eg: xyz@gmail.com
  },
  toastDuration: 6000,
  employeeTypeEmployee: 'employee',
  employeeTypeEmployee1: 'employee1',
  barChartBarWidth: 70,
  barChartWidth: 950,
  barChartHeight: 378,
  TenPercentOfViewHeight: '70px',
  NinetyPercentOfViewHeight: 'calc(100% - 70px)',
};
// theme constant
export const gridSpacing = 3;
export const drawerWidth = 260;
export const appDrawerWidth = 320;
