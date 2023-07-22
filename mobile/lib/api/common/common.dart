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
import 'package:http/http.dart' as http;

// Constant imports
import 'package:heimdall/constants/codes.dart';
import 'package:heimdall/constants/values.dart';

// Component imports
import 'package:heimdall/methods/helper_methods.dart';

/// Method will get [month] name for this Method Call &
/// a function [apiCallForPreviousMonth] from which this method is called
/// and [context] of type BuildContext
/// In case we didnt find data in responseFromApi
/// we will call same API for the previous Month
/// As a base case for recursive calls, Incase we didn't get response for January
/// We will return empty array & then show message on UI
recursiveGetDataCall(
  String monthName,
  Function apiCallForPreviousMonth,
  BuildContext context,
) {
  int previousMonthIndex = Values.months.indexOf(monthName) - 1;
  return previousMonthIndex > -1
      ? apiCallForPreviousMonth(Values.months[previousMonthIndex], context)
      : [];
}

/// This method will call api get call on the [url] and [context] passed as params
/// After receiving the response it will parse it and return the response.
Future<dynamic> callApi(
  String url,
  BuildContext context, {
  String? token,
}) async {
  String jwtToken = HelperMethods.getJwtToken(context);
  var responseFromApi = await http.get(
    Uri.parse(url),
    headers: {
      'jwt_token': token ?? jwtToken,
    },
  );
  if (StatusCodes.success == responseFromApi.statusCode &&
      ResponseCode.ok == jsonDecode(responseFromApi.body)['success']) {
    dynamic data = (jsonDecode(responseFromApi.body)['data']);
    return data;
  }
}

/// This method will call api post call on the [url], [context] and with [body] as param
/// After receiving the response it will parse it and return the response.
Future<dynamic> callPostApi(url, body, context) async {
  try {
    String jwtToken = HelperMethods.getJwtToken(context);
    var responseFromApi = await http.post(
      Uri.parse(url),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
        'jwt_token': jwtToken,
      },
      body: body,
    );
    if (responseFromApi.statusCode == StatusCodes.success) {
      return true;
    } else {
      return jsonDecode(responseFromApi.body);
    }
  } catch (err) {
    return err;
  }
}

/// This method will call api put call on the [url], [context] and with [body] as param
/// After receiving the response it will parse it and return the response.
Future<dynamic> callPutApi(url, body, context) async {
  try {
    String jwtToken = HelperMethods.getJwtToken(context);
    var responseFromApi = await http.put(
      Uri.parse(url),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
        'jwt_token': jwtToken,
      },
      body: body,
    );
    if (responseFromApi.statusCode == StatusCodes.success) {
      return true;
    } else {
      return jsonDecode(responseFromApi.body);
    }
  } catch (err) {
    return err;
  }
}
