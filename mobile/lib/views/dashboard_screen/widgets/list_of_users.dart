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

// Flutter import
import 'package:flutter/material.dart';

// 3rd party import
import 'package:flutter_bloc/flutter_bloc.dart';

// Constant imports
import 'package:heimdall/constants/assets.dart';
import 'package:heimdall/constants/sizes.dart';
import 'package:heimdall/constants/color_values.dart';
import 'package:heimdall/constants/values.dart';

// State Management import
import 'package:heimdall/store/project_list.dart';
import 'package:heimdall/store/current_project.dart';

// Model import
import 'package:heimdall/models/employee.dart';
import 'package:heimdall/models/project.dart';

// Component imports
import 'package:heimdall/methods/helper_methods.dart';
import 'package:heimdall/views/bottom_tabs/tabs/widgets/drop_down_widget.dart';
import 'package:heimdall/api/update_member.dart';
import 'package:heimdall/views/dashboard_screen/widgets/invite_user.dart';
import 'package:heimdall/views/dashboard_screen/methods/dashboard_helper_methods.dart';
import 'package:heimdall/views/widgets/custom_dialog_box.dart';

class ListOfUsers extends StatefulWidget {
  final String projectId;
  final List<Employee> currentProjectMembers;
  final Function callGetProjectDetailsApi;
  const ListOfUsers(
      this.projectId, this.currentProjectMembers, this.callGetProjectDetailsApi,
      {Key? key})
      : super(key: key);

  @override
  State<ListOfUsers> createState() => ListOfUsersState();
}

class ListOfUsersState extends State<ListOfUsers> {
  List<dynamic> projectState = [];
  List<String> userRolesList = [];
  bool isAdmin = false;
  bool isProjectManager = false;
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    projectState = BlocProvider.of<ProjectList>(context).state;
    initializeContent();
  }

  // This method will check the old state of Same Widget
  // We will compare the old and current property of projectName
  // if this is changed, we needs to fetch the new employees list
  @override
  void didUpdateWidget(ListOfUsers oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.projectId != oldWidget.projectId) {
      initializeContent();
    }
  }

  // This method will get the list of projects current user has access
  // It will then find the Project selected by comparing the unique projectName
  // Then, will set the isAdmin & isProjectManager states by finding their response
  // Will also convert user roles to readable form and add them in a list
  // this list will be later used in the ListView for dynamically changing user role states
  initializeContent() {
    Employee currentLoggedInUser = HelperMethods.findLoggedInUser(context);
    if (currentLoggedInUser.type == Values.admin) {
      setState(() => isAdmin = true);
    }

    List<String> tempUserRoles = [];
    for (Employee employee in widget.currentProjectMembers) {
      String tempRole = employee.projectIn.isNotEmpty
          ? employee.projectIn[0].role
          : Values.user;
      // Checking if the current user's id match with this employee
      // and it is Project Manager, then isProjectManager state would be true
      if (currentLoggedInUser.id == employee.id &&
          tempRole == Values.projectManager) {
        setState(() => isProjectManager = true);
      }
      tempUserRoles.add(tempRole);
    }
    setState(() {
      userRolesList = tempUserRoles;
      isLoading = false;
    });
  }

  /// This method will get [pictureUrl] from API response
  /// Will return the [NetworkImage] widget of that picture in case
  /// picture link is not empty
  /// Else, it will return [AssetImage] widget, containing default Avatar
  dynamic loadProfileAvatar(String pictureUrl) {
    return (pictureUrl.isNotEmpty)
        ? NetworkImage(pictureUrl)
        : AssetImage(Images.defaultProfileAvatar);
  }

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    return Container(
      padding: EdgeInsets.only(top: PaddingSize.listOfEmployeesTopPadding),
      child: Column(
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    Values.listOfMembers,
                    textAlign: TextAlign.start,
                    style: TextStyle(
                      color: ColorValues.primaryTextColor,
                      fontSize: FontSize.text,
                    ),
                  ),
                  if (isAdmin || isProjectManager)
                    IconButton(
                      onPressed: () => {
                        CustomDialogBox.showDialogBox(
                          context: context,
                          title: Values.inviteUser,
                          customWidget: InviteUser(
                            widget.projectId,
                            widget.callGetProjectDetailsApi,
                          ),
                        )
                      },
                      color: ColorValues.primaryTextColor,
                      icon: Icon(
                        IconsList.inviteUserIcon,
                      ),
                    ),
                ],
              ),
              Divider(
                height: CustomSize.dividerSize,
                thickness: CustomSize.dashboardDividerThickness,
                color: ColorValues.secondaryTextColor,
              ),
            ],
          ),
          Expanded(
            child: !isLoading
                ? ListView.separated(
                    separatorBuilder: (BuildContext context, int index) =>
                        Divider(
                          height: CustomSize.dividerSize,
                          thickness: CustomSize.dashboardDividerThickness,
                          color: ColorValues.secondaryTextColor,
                        ),
                    physics: const AlwaysScrollableScrollPhysics(),
                    padding: EdgeInsets.symmetric(
                        horizontal: PaddingSize.employeesListViewPadding),
                    itemCount: widget.currentProjectMembers.length,
                    itemBuilder: (BuildContext context, int index) {
                      return Container(
                        color: DashboardScreenHelperMethods
                            .setupMemberBackgroundColor(
                          email: widget.currentProjectMembers[index].email,
                          context: context,
                        ),
                        padding: EdgeInsets.only(
                          left: screenSize.width *
                              PaddingSize.currentUserLeftPaddingPercentage,
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              children: [
                                Padding(
                                  padding: EdgeInsets.only(
                                      right:
                                          PaddingSize.employeesListViewPadding),
                                  child: Container(
                                    width: CustomSize.employeeImageWidth,
                                    height: CustomSize.employeeImageHeight,
                                    decoration: BoxDecoration(
                                      shape: BoxShape.circle,
                                      image: DecorationImage(
                                        image: loadProfileAvatar(widget
                                            .currentProjectMembers[index]
                                            .picture),
                                        fit: BoxFit.fill,
                                      ),
                                    ),
                                  ),
                                ),
                                Text(
                                  DashboardScreenHelperMethods.findMemberName(
                                    member: widget.currentProjectMembers[index],
                                    context: context,
                                  ),
                                  style: TextStyle(
                                      color: ColorValues.primaryTextColor,
                                      fontWeight: FontWeight.w500,
                                      fontSize: FontSize.smallText),
                                ),
                              ],
                            ),
                            Row(
                              children: [
                                !(isAdmin ||
                                        (isProjectManager &&
                                            !HelperMethods.isCurrentUser(
                                                context: context,
                                                email: widget
                                                    .currentProjectMembers[
                                                        index]
                                                    .email)))
                                    ? Padding(
                                        padding: EdgeInsets.all(
                                            PaddingSize.userRolePadding),
                                        child: Text(
                                          userRolesList[index],
                                          style: TextStyle(
                                            color: ColorValues.primaryTextColor,
                                          ),
                                        ),
                                      )
                                    : DropDownWidget(
                                        itemsList: Values.userRoles,
                                        callback: (value) {
                                          List<String> tempUserRoles =
                                              userRolesList;
                                          tempUserRoles[index] = value;
                                          setState(() =>
                                              userRolesList = tempUserRoles);
                                          updateMember(
                                            widget.currentProjectMembers[index]
                                                .id,
                                            (BlocProvider.of<CurrentProject>(
                                                        context)
                                                    .state as Project)
                                                .id,
                                            context,
                                            role: value,
                                          ).then((response) {
                                            if (response) {
                                              widget.callGetProjectDetailsApi();
                                            }
                                          }).catchError((err) {
                                            HelperMethods.showErrorToast(
                                                context, err);
                                          });
                                        },
                                        selectedValue: userRolesList[index],
                                      ),
                                if (isAdmin ||
                                    (isProjectManager &&
                                        !HelperMethods.isCurrentUser(
                                            context: context,
                                            email: widget
                                                .currentProjectMembers[index]
                                                .email)))
                                  IconButton(
                                    onPressed: () {
                                      updateMember(
                                        widget.currentProjectMembers[index].id,
                                        (BlocProvider.of<CurrentProject>(
                                                    context)
                                                .state as Project)
                                            .id,
                                        context,
                                      ).then((response) {
                                        if (response) {
                                          widget.callGetProjectDetailsApi();
                                        }
                                      }).catchError((err) {
                                        HelperMethods.showErrorToast(
                                            context, err);
                                      });
                                    },
                                    color: ColorValues.primaryTextColor,
                                    icon: Icon(
                                      IconsList.removeUserIcon,
                                    ),
                                  ),
                              ],
                            ),
                          ],
                        ),
                      );
                    })
                : const Center(
                    child: CircularProgressIndicator(),
                  ),
          ),
        ],
      ),
    );
  }
}
