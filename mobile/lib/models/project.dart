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
import './employee.dart';

class Project {
  final String id;
  final String name;
  final String description;
  final String url;
  final List<Employee> projectMember;

  const Project({
    required this.id,
    this.name = '',
    this.description = '',
    this.url = '',
    this.projectMember = const [],
  });

  // Method gets the list of json List
  // It will convert the input into List<Employee>
  static convertMembersListToEmployeeModel(List<dynamic> membersJson) {
    List<Employee> employeesList = [];
    for (Map<String, dynamic> member in membersJson) {
      employeesList.add(Employee.fromJson(member));
    }
    return employeesList;
  }

  Project.fromJson(Map<String, dynamic> json)
      : id = json['_id'],
        name = json['name'],
        description = json['description'],
        url = json['fileUrl'],
        projectMember =
            convertMembersListToEmployeeModel(json['project_members']);

  Map<String, dynamic> toJson() => {
        '_id': id,
        'name': name,
        'description': description,
        'project_members': projectMember,
        'fileUrl': url,
      };
}
