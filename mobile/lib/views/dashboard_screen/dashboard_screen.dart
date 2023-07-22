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

// 3rd party imports
import 'package:flutter_bloc/flutter_bloc.dart';

// Constant imports
import 'package:heimdall/constants/assets.dart';
import 'package:heimdall/constants/color_values.dart';
import 'package:heimdall/constants/sizes.dart';
import 'package:heimdall/constants/values.dart';

// Model imports
import 'package:heimdall/models/employee.dart';
import 'package:heimdall/models/user_project.dart';

// State Management imports
import 'package:heimdall/store/logged_in_user.dart';
import 'package:heimdall/store/project_list.dart';
import 'package:heimdall/store/jwt_token.dart';

// Component imports
import 'package:heimdall/views/bottom_tabs/tabs/widgets/drop_down_widget.dart';
import 'package:heimdall/views/dashboard_screen/widgets/project_ellipsis.dart';
import 'package:heimdall/views/widgets/app_bar_widget.dart';
import 'package:heimdall/views/dashboard_screen/methods/dashboard_helper_methods.dart';
import 'package:heimdall/methods/helper_methods.dart';
import 'package:heimdall/views/dashboard_screen/widgets/data_not_found.dart';

class DashboardScreen extends StatefulWidget {
  final Employee user;
  final List<UserProject> projectListResponse;
  final String jwtToken;
  const DashboardScreen(this.user, this.projectListResponse, this.jwtToken,
      {Key? key})
      : super(key: key);

  @override
  State<DashboardScreen> createState() => DashboardScreenState();
}

class DashboardScreenState extends State<DashboardScreen> {
  late JwtToken _jwtToken;
  late LoggedInUser _loggedInUser;
  late ProjectList _projectList;
  static List<String> projectsList = [];
  String selectedProject = '';
  String projectDescription = '';
  bool isLoading = true;
  bool noProjectFound = false;
  static List<Employee> currentProjectMembers = [];

  @override
  void initState() {
    super.initState();

    // Store data in Shared preference
    HelperMethods.storeDataInSharedPreference(
      token: widget.jwtToken,
      employee: widget.user,
    );

    // Storing the token in the State Management
    _jwtToken = BlocProvider.of<JwtToken>(context);
    _jwtToken.saveToken(widget.jwtToken);

    // Storing the current logged in user in the State Management
    _loggedInUser = BlocProvider.of<LoggedInUser>(context);
    _loggedInUser.saveUser(widget.user);

    // Storing the list of Projects current user has access
    // in the State Management
    List<UserProject> projectList = [];
    for (UserProject userProject in widget.projectListResponse) {
      projectList.add(userProject);
    }
    _projectList = BlocProvider.of<ProjectList>(context);
    _projectList.saveProjects(projectList);

    List<String> projects =
        DashboardScreenHelperMethods.findProjectsList(_projectList);
    if (projects.isNotEmpty) {
      DashboardScreenHelperMethods.fetchProjectDetails(
        _projectList,
        projects[0],
        isLoading,
        (val) => setState(() => isLoading = val),
        context,
        (val) => setState(() => projectDescription = val),
        (val) => setState(() => currentProjectMembers = val),
      );
      projectsList = projects;
      selectedProject = projects[0];
    } else {
      noProjectFound = true;
    }
  }

  void callGetProjectDetailsApi() {
    DashboardScreenHelperMethods.fetchProjectDetails(
      _projectList,
      selectedProject,
      true,
      (val) => setState(() => isLoading = val),
      context,
      (val) => setState(() => projectDescription = val),
      (val) => setState(() => currentProjectMembers = val),
    );
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        appBar: AppBarWidget(
          Values.dashboard,
          leadingIcon: false,
        ),
        backgroundColor: ColorValues.primaryTextColor,
        body: Container(
          color: ColorValues.primary,
          child: !noProjectFound
              ? Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Expanded(
                      child: Container(
                        padding: EdgeInsets.all(PaddingSize.dashboardPadding),
                        child: Card(
                          color: ColorValues.secondary,
                          semanticContainer: true,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(
                                CustomSize.cardCircularRadius),
                          ),
                          child: Padding(
                            padding: EdgeInsets.symmetric(
                                horizontal: PaddingSize.dashboardPadding),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                DropDownWidget(
                                  alignment: Alignment.center,
                                  itemsList: HelperMethods.dropdownItemsList(
                                      projectsList),
                                  selectedValue: selectedProject,
                                  callback: (val) {
                                    if (val != selectedProject) {
                                      DashboardScreenHelperMethods
                                          .fetchProjectDetails(
                                        _projectList,
                                        val,
                                        isLoading,
                                        (val) =>
                                            setState(() => isLoading = val),
                                        context,
                                        (val) => setState(
                                            () => projectDescription = val),
                                        (val) => setState(
                                            () => currentProjectMembers = val),
                                      );
                                      setState(() => selectedProject = val);
                                    }
                                  },
                                ),
                                Padding(
                                  padding: EdgeInsets.only(
                                      top: PaddingSize.dashboardPadding),
                                  child: Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text(
                                        selectedProject,
                                        textAlign: TextAlign.start,
                                        style: TextStyle(
                                          color: ColorValues.primaryTextColor,
                                          fontSize: FontSize.text,
                                        ),
                                      ),
                                      if (!isLoading)
                                        Row(
                                          children: [
                                            IconButton(
                                              onPressed: () =>
                                                  DashboardScreenHelperMethods
                                                      .handleOpenChartClick(
                                                          context),
                                              color:
                                                  ColorValues.primaryTextColor,
                                              icon: Icon(
                                                IconsList.openChartsIcon,
                                              ),
                                            ),
                                            ProjectEllipsis(
                                              selectedItem: (value) {
                                                DashboardScreenHelperMethods
                                                    .showProjectDialogBox(
                                                  context: context,
                                                  selectedMenuItem: value,
                                                );
                                              },
                                            ),
                                          ],
                                        ),
                                    ],
                                  ),
                                ),
                                Divider(
                                  height: CustomSize.dividerSize,
                                  thickness:
                                      CustomSize.dashboardDividerThickness,
                                  color: ColorValues.secondaryTextColor,
                                ),
                                if (!isLoading)
                                  Text(
                                    projectDescription,
                                    textAlign: TextAlign.start,
                                    style: TextStyle(
                                      color: ColorValues.primaryTextColor
                                          .withOpacity(CustomSize
                                              .colorOpacityForProjectDescription),
                                      fontSize: FontSize.smallText,
                                    ),
                                  ),
                                DashboardScreenHelperMethods
                                    .loadListOfUsersWidget(
                                        isLoading,
                                        _projectList,
                                        selectedProject,
                                        currentProjectMembers,
                                        callGetProjectDetailsApi),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                )
              : DataNotFound(
                  '${Values.noProjectFound}: ${HelperMethods.findLoggedInUser(context).name}',
                  Values.contactAdmin,
                  IconsList.errorIcon,
                  IconSize.huge,
                  ColorValues.error,
                ),
        ),
      ),
    );
  }
}
