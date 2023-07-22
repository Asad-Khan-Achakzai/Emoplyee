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

// Model import
import './user_project.dart';

class Employee {
  final String id;
  final String name;
  final String email;
  final String picture;
  final String type;
  final List<UserProject> projectIn;

  const Employee({
    required this.id,
    this.name = '',
    this.email = '',
    this.picture = '',
    this.type = '',
    this.projectIn = const [],
  });

  /// Method gets the list of json List
  /// It will convert the input into [List<ModifiedProject>]
  static List<UserProject> convertToUserProjectModel(
      {required List<dynamic> projectsJson}) {
    List<UserProject> projectsList = [];
    for (Map<String, dynamic> project in projectsJson) {
      projectsList.add(UserProject.fromJson(project));
    }
    return projectsList;
  }

  Employee.fromJson(Map<String, dynamic> json)
      : id = json['_id'],
        // Incase of invited users, this property wouldn't be defined
        name = json['name'] ?? '',
        email = json['email'],
        // Incase of invited users, this property wouldn't be defined
        picture = json['picture'] ?? '',
        type = json['type'] ?? '',
        projectIn = convertToUserProjectModel(
          projectsJson: json['project_in'],
        );

  Map<String, dynamic> toJson() => {
        '_id': id,
        'name': name,
        'email': email,
        'picture': picture,
        'type': type,
        'project_in': projectIn,
      };
}
