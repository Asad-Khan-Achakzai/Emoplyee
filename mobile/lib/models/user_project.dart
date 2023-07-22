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

// Constant imports
import '../constants/values.dart';

class UserProject {
  final String id;
  final String name;
  final String role;
  final String status;

  const UserProject({
    required this.id,
    this.name = '',
    this.role = '',
    this.status = '',
  });

  /// Method will get the status code 0 or 1 from API as [status]
  /// Will return the usable status pending or accepted
  static String parseStatusToString({required int status}) {
    switch (status) {
      case 0:
        return Values.pending;
      case 1:
        return Values.accepted;
      default:
        return Values.pending;
    }
  }

  /// Method will get the status value Pending or Accepted from model as [status]
  /// Will return status code 0 or 1
  static int parseStatusToInt({required String status}) {
    switch (status) {
      case 'Pending':
        return 0;
      case 'Accepted':
        return 1;
      default:
        return 0;
    }
  }

  UserProject.fromJson(Map<String, dynamic> json)
      : id = json['id'] ?? json['project_id'],
        name = json['name'] ?? json['project_name'],
        role = json['role'] ?? Values.user,
        status = parseStatusToString(status: json['status'] ?? 0);

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'role': role,
        'status': parseStatusToInt(status: status),
      };
}
