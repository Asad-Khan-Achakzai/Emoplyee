/*
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

class Values {
  static String appName = 'Heimdall';
  static String loginPage = 'Login Page';
  static String appDescription = 'Sign in and start managing your candidates!';
  static String loginWithGoogle = 'Log In with Google';
  static String properties = 'Properties';
  static String employees = 'Employees';
  static String summary = 'Summary';
  static String compare = 'Compare';
  static String widgetDetailMessage = 'Tap on above bar to view detail';
  static String count = 'Count';
  static String engineer = 'Engineer';
  static String month = 'Month';
  static String week = 'Week';
  static String signInFailed = 'Sign in Failed';
  static String addNewComment = 'Add new comment';
  static String confirmation = 'Confirmation';
  static String cancel = 'Cancel';
  static String send = 'Send';
  static String dateFormat = 'dd-MM-yyyy';
  static String comment = 'comment';
  static String notableComments = 'notable_comments';
  static String noDataFound = 'No data found for the year';
  static String barChart = 'bar';
  static String pieChart = 'pie';
  static String selectEmployeesForComparison =
      'Select Employees to display the comparison';
  static String filter = 'Filter';
  static String employee1 = 'Employee 1';
  static String employee2 = 'Employee 2';
  static String listOfMembers = 'Members';
  static String admin = 'Admin';
  static String role = 'role';
  static String projectManager = 'Project Manager';
  static String user = 'User';
  static String inviteMember = 'Invite';
  static String enterEmail = 'Enter Email';
  static String noProjectFound = 'No project found for the user';
  static String contactAdmin = 'Please contact Admin!';
  static String pending = 'Pending';
  static String accepted = 'Accepted';
  static String dashboard = 'Dashboard';
  static String allweeks = 'All Weeks';
  static String inviteUser = 'Invite User';
  static String addProject = 'Add Project';
  static String editProject = 'Edit Project';
  static String deleteProject = 'Delete Project';
  static String name = 'name';
  static String data = 'data';
  static String employee = 'employee';
  static String projectName = 'Project Name';
  static String projectUrl = 'Project Url';
  static String projectDescription = 'Project Description';
  static String add = 'Add';
  static String edit = 'Edit';
  static String warningForDeleteProject =
      'Are you sure you want to remove this project?';
  static String yes = 'Yes';
  static String no = 'No';
  static String description = 'description';
  static String fileUrl = 'fileUrl';
  static String update = 'Update';

  static Map<String, String> monthsList = {
    'Jan': 'January',
    'Feb': 'February',
    'Mar': 'March',
    'Apr': 'April',
    'May': 'May',
    'Jun': 'June',
    'Jul': 'July',
    'Aug': 'August',
    'Sep': 'September',
    'Oct': 'October',
    'Nov': 'November',
    'Dec': 'December',
  };

  static List<String> months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  static List<String> userRoles = [
    'User',
    'Project Manager',
  ];

  static List<String> weeksList = [
    'week1',
    'week2',
    'week3',
    'week4',
    'week5',
  ];
}

enum ProjectMenu { addProject, editProject, deleteProject }
