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
import 'dart:convert';

// 3rd party import
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;

// Component imports
import 'package:heimdall/api/login_with_google_api.dart';
import 'package:heimdall/methods/helper_methods.dart';

// Model imports
import 'package:heimdall/models/employee.dart';

// Constant imports
import 'package:heimdall/constants/api_urls.dart';

// This Method will send request to Google Login API
// After getting response of Access Token, will send token to our API
// After successful response user will be returned
loginApi() async {
  var accessToken = await loginWithGoogleApi();
  // Access Token get from Google API will be sent to our API
  var url =
      '${dotenv.env['URL']}:${dotenv.env['PORT']}${ApiUrls.loginApi}$accessToken';
  var responseFromApi = await http.get(Uri.parse(url));
  if (responseFromApi.statusCode == 200) {
    Map<String, dynamic> data = jsonDecode(responseFromApi.body)['data'];
    Map<String, dynamic> employeeMap = data['employee'];
    Employee user = Employee.fromJson(employeeMap);

    return {
      'user': user,
      'projectList': HelperMethods.findProjectListFromApiResponse(
        user: user,
        projects: data['projects'] ?? [],
      ),
      'jwtToken': data['token'],
    };
  }
  // In case of not getting required response error will be thrown
  // It will be catched in the google_login_button.dart file
  throw Error();
}
