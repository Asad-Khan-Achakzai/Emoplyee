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

// Flutter imports
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

// Constant imports
import 'package:heimdall/constants/color_values.dart';
import 'package:heimdall/constants/project_menu.dart';
import 'package:heimdall/constants/toast_messages.dart';
import 'package:heimdall/constants/values.dart';
import 'package:heimdall/constants/assets.dart';

// Model imports
import 'package:heimdall/models/project.dart';
import 'package:heimdall/models/employee.dart';
import 'package:heimdall/models/user_project.dart';

// Component imports
import 'package:heimdall/methods/helper_methods.dart';
import 'package:heimdall/api/get_project_details.dart';
import 'package:heimdall/api/add_project.dart';
import 'package:heimdall/views/bottom_tabs/bottom_tab_navigator.dart';
import 'package:heimdall/views/dashboard_screen/widgets/project_fields.dart';
import 'package:heimdall/views/dashboard_screen/widgets/list_of_users.dart';
import 'package:heimdall/views/widgets/custom_dialog_box.dart';
import 'package:heimdall/api/update_project.dart';

// State Management imports
import 'package:heimdall/store/project_list.dart';
import 'package:heimdall/store/current_project.dart';

class DashboardScreenHelperMethods {
  /// It will take the following parameters
  /// [projectList] of type ProjectList
  /// [projectName] of type String
  /// [isLoading] of type bool
  /// [setIsLoading] of type Function
  /// [context] of type BuildContext
  /// [setProjectDescription] of type Function
  /// [setCurrentProjectMembers] of type Function
  /// Method will get projectId from method findProjectId()
  /// After parsing response to Project model, State values
  /// for isLoading and projectDescription & currentProjectMembers is changed
  static fetchProjectDetails(
    ProjectList projectList,
    String projectName,
    bool isLoading,
    Function setIsLoading,
    BuildContext context,
    Function setProjectDescription,
    Function setCurrentProjectMembers,
  ) {
    if (!isLoading) {
      setIsLoading(true);
    }
    String projectId =
        DashboardScreenHelperMethods.findProjectId(projectList, projectName);
    getProjectDetails(projectId, context).then((projectDetails) {
      Project projectObj = Project.fromJson(projectDetails);
      saveProjectObject(context, projectObj);
      setProjectDescription(projectObj.description);
      setCurrentProjectMembers(projectObj.projectMember);
      setIsLoading(false);
    }).catchError((err) {
      HelperMethods.showErrorToast(context, err);
    });
  }

  /// This method will fetch the [projectList] response
  /// and return a List containing names of projects only
  /// for usage in drop-down menu
  static List<String> findProjectsList(projectList) {
    List<String> projectNames = [];
    for (UserProject project in projectList.state) {
      projectNames.add(project.name);
    }
    return projectNames;
  }

  /// This method will fetch the [projectList] response and [projectName]
  /// and return project Id of that [projectName]
  static String findProjectId(projectList, String projectName) {
    for (UserProject project in projectList.state) {
      if (project.name == projectName) {
        return project.id;
      }
    }
    return '';
  }

  /// Method will get [context] of type [BuildContext]
  /// and [project] of type [Project] as params
  /// Method will call [saveProjectData] to save project in State Management
  static void saveProjectObject(BuildContext context, Project project) {
    CurrentProject projectContext = BlocProvider.of<CurrentProject>(context);
    projectContext.saveProjectData(project);
  }

  /// Method will get [context] and [projectName] as params
  /// Method will call [saveProjectMethod] to save it in State Management
  /// will navigate the screen to [BottomTabNavigator]
  static handleOpenChartClick(context) {
    Navigator.of(context).push(
      MaterialPageRoute(builder: (_) => const BottomTabNavigator()),
    );
  }

  /// It will take the following parameters
  /// [loadingState] of type bool
  /// [projectList] of type ProjectList
  /// [selectedProject] of type String
  /// [currentProjectMembers] of type List<Employee>
  /// It will check for the [loadingState], when it will be false,
  /// ListOfUsers widget would be returned, else a loader would be displayed
  static Widget loadListOfUsersWidget(
      bool loadingState,
      ProjectList projectList,
      String selectedProject,
      List<Employee> currentProjectMembers,
      Function callGetProjectDetailsApi) {
    return !loadingState
        ? Expanded(
            child: ListOfUsers(
              findProjectId(projectList, selectedProject),
              currentProjectMembers,
              callGetProjectDetailsApi,
            ),
          )
        : const Center(
            child: CircularProgressIndicator(),
          );
  }

  /// Method will get the [email] of type String
  /// and [context] of type BuildContext as params
  /// It will return the highlighted Color incase the email
  /// matched with the logged in user.
  static Color setupMemberBackgroundColor(
      {required String email, required BuildContext context}) {
    return email == HelperMethods.findLoggedInUser(context).email
        ? ColorValues.primary.withOpacity(0.3)
        : ColorValues.transparentColor;
  }

  /// Method will get the [member] object of type [Employee]
  /// and [context] of type BuildContext as params
  /// It will return the name of member incase it's not empty
  /// Else it will return the email of that member, by spliting with @
  static String findMemberName(
      {required Employee member, required BuildContext context}) {
    return member.name.isNotEmpty ? member.name : member.email.split('@')[0];
  }

  /// Method gets [context] and [selectedMenuItem] as params
  /// It will use switch statement to show relevant dialog box
  static showProjectDialogBox({
    required BuildContext context,
    required String selectedMenuItem,
  }) {
    switch (selectedMenuItem) {
      case ProjectMenuItems.addProject:
        CustomDialogBox.showDialogBox(
          context: context,
          title: Values.addProject,
          customWidget: ProjectFields(
            action: Values.add,
            icon: IconsList.addProject,
            onPressed: addProject,
            eventSuccessMessage: ToastMessages.addProjectSuccessful,
            eventFailureMessage: ToastMessages.addProjectFailed,
          ),
        );
        break;
      case ProjectMenuItems.editProject:
        Project currentProject = HelperMethods.findProject(context);
        CustomDialogBox.showDialogBox(
          context: context,
          title: Values.editProject,
          customWidget: ProjectFields(
            name: currentProject.name,
            description: currentProject.description,
            url: currentProject.url,
            action: Values.update,
            icon: IconsList.editProject,
            onPressed: updateProject,
            eventSuccessMessage: ToastMessages.updateProjectSuccessful,
            eventFailureMessage: ToastMessages.updateProjectFailed,
          ),
        );
        break;
      case ProjectMenuItems.deleteProject:
        CustomDialogBox.showDialogBox(
            context: context,
            title: Values.deleteProject,
            customWidget: Text(Values.warningForDeleteProject),
            actionButtonTitle: Values.yes,
            secondActionButtonTitle: Values.no,
            onActionButtonPressed: () {
              // TODO: Will add API call later
            });
        break;
    }
  }
}
