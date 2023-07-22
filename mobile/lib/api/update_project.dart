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

// 3rd party import
import 'package:flutter_dotenv/flutter_dotenv.dart';

// Constant imports
import 'package:heimdall/constants/api_urls.dart';
import 'package:heimdall/constants/values.dart';

// Component imports
import 'package:heimdall/api/common/common.dart';
import 'package:heimdall/methods/helper_methods.dart';

/// This method will call Post API for inviteUser
/// it will get [projectId] of type String
/// [email] of type String, and
/// [projectName] of type String
/// [context] of type BuildContext
/// It will return the response from API
Future<dynamic> updateProject({
  required BuildContext context,
  required String name,
  required String description,
  required String fileUrl,
}) async {
  try {
    String projectId = HelperMethods.findProjectId(context);
    String url =
        '${dotenv.env['BASEURL']}${ApiUrls.getProject}$projectId${ApiUrls.projectUpdate}';
    return callPutApi(
      url,
      jsonEncode(<String, String>{
        Values.name: name,
        Values.description: description,
        Values.fileUrl: fileUrl,
      }),
      context,
    );
  } catch (err) {
    return err;
  }
}
