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
import 'dart:convert';

// 3rd party import
import 'package:flutter_dotenv/flutter_dotenv.dart';

// Constant imports
import 'package:heimdall/constants/api_urls.dart';

// Component imports
import 'package:heimdall/api/common/common.dart';

/// This method will call Post API for inviteUser
/// it will get [employeeId] of type String
/// [projectId] of type String,
/// [context] of type BuildContext, and
/// [role] of type String?
/// It will return the response from API
Future<dynamic> updateMember(
  String employeeId,
  String projectId,
  BuildContext context, {
  String? role = '',
}) async {
  try {
    String url =
        '${dotenv.env['BASEURL']}${ApiUrls.getEmployee}$employeeId${ApiUrls.update}$projectId';

    return callPostApi(
      url,
      role!.isNotEmpty
          ? jsonEncode(<String, String>{
              'role': role,
            })
          : jsonEncode(<String, bool>{
              'remove': true,
            }),
      context,
    );
  } catch (err) {
    return err;
  }
}
