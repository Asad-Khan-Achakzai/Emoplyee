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
import 'dart:convert';
import 'package:flutter/material.dart';

// 3rd party imports
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:jwt_decode/jwt_decode.dart';

// Model imports
import 'package:heimdall/models/employee.dart';
import 'package:heimdall/models/project.dart';
import 'package:heimdall/models/user_project.dart';

// Constant imports
import 'package:heimdall/constants/values.dart';
import 'package:heimdall/constants/assets.dart';
import 'package:heimdall/constants/color_values.dart';

// State Management imports
import 'package:heimdall/store/logged_in_user.dart';
import 'package:heimdall/store/current_project.dart';
import 'package:heimdall/store/jwt_token.dart';

// Component imports
import 'package:heimdall/views/login_screen/login_screen.dart';
import 'package:heimdall/views/dashboard_screen/dashboard_screen.dart';
import 'package:heimdall/api/get_projects_list.dart';

class HelperMethods {
  // Unique and Sort list
  static List<String> dropdownItemsList(list) {
    return list.toSet().toList()..sort();
  }

  // Unique list
  static List<Map<String, String>> uniqueList(list) {
    return list.toSet().toList();
  }

  // Method will return the propertyValue from ths given item
  static findPropertyValue(Map<String, String> item) {
    String response = '';
    item.forEach(
      (propertyKey, propertyValue) {
        response = propertyValue;
      },
    );
    return response;
  }

  // It will return the Key, value pair item
  // by getting input of List of Key,Value items and Value of required item
  static findPropertyKey(String item, List propertiesList) {
    Map<String, String> response = {};
    for (var element in propertiesList) {
      element.forEach((propertyKey, propertyValue) {
        if (item == propertyValue) {
          response = element;
        }
      });
    }
    return response;
  }

  // Method will return the Property Key from key,value pair item
  static findPropertyKeyFromItem(property) {
    String response = '';
    property.forEach(
      (propertyKey, propertyValue) {
        response = propertyKey;
      },
    );
    return response;
  }

  // Method will return the List of Property Values from key,value pair List
  static findPropertiesList(List<Map<String, String>> list) {
    List<String> response = [];
    for (var element in list) {
      element.forEach(
        (propertyKey, propertyValue) {
          response.add(propertyValue);
        },
      );
    }
    return dropdownItemsList(response);
  }

  /// It will show an error message on the UI
  /// Takes the context of the screen in [context]
  /// Takes the errorMessage to be shown in [errorMessage]
  static showErrorToast(context, errorMessage) {
    return ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(errorMessage.toString()),
      ),
    );
  }

  static String findMonth() {
    return Values.months[DateTime.now().month - 1].substring(0, 3);
  }

  static LinearGradient linearGradientColors(Color startColor, Color endColor,
      double firstAnimationClockValue, double secondAnimationClockValue) {
    return LinearGradient(
      colors: [
        ColorTween(
          begin: startColor,
          end: endColor,
        ).lerp(firstAnimationClockValue)!,
        ColorTween(
          begin: startColor,
          end: endColor,
        ).lerp(secondAnimationClockValue)!,
      ],
      begin: Alignment.bottomCenter,
      end: Alignment.topCenter,
    );
  }

  /// Method will get the [context]
  /// and returns current logged in [user] of type [Employee]
  static Employee findLoggedInUser(context) {
    LoggedInUser userContext = BlocProvider.of<LoggedInUser>(context);
    Employee user = (userContext.state);
    return user;
  }

  /// Method will get the [context]
  /// and returns the [id] of type String for the current selected [Project]
  static String findProjectId(context) {
    Project project = BlocProvider.of<CurrentProject>(context).state;
    return project.id;
  }

  /// Method will get the [context]
  /// and returns the [id] of type String for the current selected [Project]
  static Project findProject(context) {
    return BlocProvider.of<CurrentProject>(context).state;
  }

  /// Method will get [user] of type [Employee]
  /// and [projects] of type [List<Map<String, dynamic>>]
  /// It will check the type of logged in user
  /// In case, User is Admin List is fetched from projects
  /// and parse to become [List<UserProject>] and returned
  /// Else, projectIn property from user's model will be returned.
  static List<UserProject> findProjectListFromApiResponse({
    required Employee user,
    required List<dynamic> projects,
  }) {
    List<UserProject> projectList = [];
    if (user.type == Values.admin) {
      for (Map<String, dynamic> project in projects) {
        projectList.add(UserProject.fromJson(project));
      }
    } else {
      projectList = user.projectIn;
    }
    return projectList;
  }

  /// This method will get [pictureUrl] from API response
  /// Will return the [NetworkImage] widget of that picture in case
  /// picture link is not empty
  /// Else, it will return [AssetImage] widget, containing default Avatar
  static dynamic loadProfileAvatar(String pictureUrl) {
    return (pictureUrl.isNotEmpty)
        ? NetworkImage(pictureUrl)
        : AssetImage(Images.defaultProfileAvatar);
  }

  /// This will be get the [context] of type [BuildContext]
  /// It will be used on press of logout button
  static void navigateToLoginScreen(BuildContext context) {
    storeDataInSharedPreference(token: '', employee: null);
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(
        builder: (BuildContext context) => const LoginScreen(
          isLoading: false,
        ),
      ),
    );
  }

  /// Method will get the [context]
  /// and returns the [JwtToken] of type String for the current logged in user
  static String getJwtToken(context) {
    JwtToken jwtToken = BlocProvider.of<JwtToken>(context);
    return jwtToken.state;
  }

  /// Method will get [token] os type String
  /// and [employee] of type [Employee]
  /// This will store these values in storage
  static Future<void> storeDataInSharedPreference({
    required String token,
    required Employee? employee,
  }) async {
    final sharedPreference = await SharedPreferences.getInstance();
    sharedPreference.setString('token', token);
    sharedPreference.setString('employee', jsonEncode(employee));
  }

  /// Method will return the dynamic object containing
  /// [token] and [employee] object
  /// This will store these values in storage
  static Future<dynamic> getDataFromSharedPreference() async {
    final sharedPreference = await SharedPreferences.getInstance();
    String? token = sharedPreference.getString('token');
    Employee? employee;
    if (!isJwtTokenExpired(token)) {
      Map<String, dynamic> employeeMap =
          jsonDecode(sharedPreference.getString('employee')!)
              as Map<String, dynamic>;
      if (employeeMap['_id']!.toString().isNotEmpty) {
        employee = Employee.fromJson(employeeMap);
      }
    }
    return {
      'token': token ?? '',
      'employee': employee,
    };
  }

  /// Method will get [jwtToken] os type String as param
  /// will validate using a 3rd party package by checking it's expiry date
  /// and return the boolean response
  static bool isJwtTokenExpired(String? jwtToken) {
    return Jwt.isExpired(jwtToken.toString());
  }

  /// This method will be called from init method of LoginScreen
  /// This method will get [context] of type [BuildContext]
  /// and [stopLoader] of type [Function] to stop the loader.
  /// Method will call getDataFromSharedPreference() to retrieve the stored token
  /// If it exists then API will be called to fetch projects List
  /// which will be then passed to Dashboard Screen for navigation
  static void navigateToInitialScreen(
      BuildContext context, Function stopLoader) {
    getDataFromSharedPreference().then((response) {
      if (response['token'].isNotEmpty && (response['employee']) != null) {
        getProjectsList(
          (response['employee']).id,
          context,
          token: response['token'],
        ).then((projectsListResponse) {
          List<UserProject> projectsList = [];
          for (Map<String, dynamic> project in projectsListResponse) {
            projectsList.add(UserProject.fromJson(project));
          }
          navigateToDashboardScreen(
            context: context,
            employee: response['employee'],
            projectsList: projectsList,
            jwtToken: response['token'],
          );
        }).catchError((error) {
          stopLoader();
        });
      }
      stopLoader();
    }).catchError((error) {
      stopLoader();
      showErrorToast(context, error);
    });
  }

  /// This will be get the [context] of type [BuildContext]
  /// [employee] of type [Employee]
  /// [projectsList] of type [List<UserProject>]
  /// [jwtToken] of type [String]
  /// This method will be called to maintain the session of logged in user
  static void navigateToDashboardScreen(
      {required BuildContext context,
      required Employee employee,
      required List<UserProject> projectsList,
      required String jwtToken}) {
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(
        builder: (BuildContext context) =>
            DashboardScreen(employee, projectsList, jwtToken),
      ),
    );
  }

  /// Method will get [context] of type [BuildContext]
  /// and [email] of type String as params
  /// Method will check if the current logged in user has same email
  /// will return the response as [bool] type value
  static bool isCurrentUser(
      {required BuildContext context, required String email}) {
    return email == findLoggedInUser(context).email;
  }

  /// It will show message on the UI
  /// Takes the context of the screen in [context]
  /// Takes the message to be shown in [message]
  /// and optional Color value as [backgroundColor]
  static showToastMessage({
    required BuildContext context,
    required String message,
    Color? backgroundColor,
  }) {
    return ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor:
            backgroundColor ?? ColorValues.primary.withOpacity(0.8),
      ),
    );
  }
}
