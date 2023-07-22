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
import 'package:heimdall/methods/helper_methods.dart';

/// Method will get [month] of type String
/// and [context] of type BuildContext
/// Method will call method [callApi] for the getMonthlyData API endpoint
/// if data is fecthed for queried month, it will be returned.
/// Else, recursive call of that method for previous month is made, until
/// no data is found for January(starting month of year, base case).
Future<dynamic> getMonthlyData(String month, BuildContext context) async {
  String projectId = HelperMethods.findProjectId(context);
  String url =
      '${dotenv.env['BASEURL']}${ApiUrls.getMonthlyData}$projectId/$month';
  return callApi(url, context).then((response) {
    if (response != null) {
      return response;
    } else {
      return recursiveGetDataCall(month, getMonthlyData, context);
    }
  });
}
