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

// 3rd party import
import 'package:flutter_dotenv/flutter_dotenv.dart';

// Constant imports
import 'package:heimdall/constants/api_urls.dart';

// Component imports
import 'package:heimdall/api/common/common.dart';

/// This method will call the API for getProjectDetails
/// it will get [projectId] of type String? and
/// it will get [context] of type BuildContext as params
/// It will return the response from API
dynamic getProjectDetails(String? projectId, BuildContext context) async {
  String url =
      '${dotenv.env['BASEURL']}${ApiUrls.getProject}$projectId${ApiUrls.getDetails}';
  return callApi(url, context);
}
