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

// Component imports
import 'package:heimdall/methods/helper_methods.dart';

// Model imports
import 'package:heimdall/models/user_story.dart';
import 'package:heimdall/models/week.dart';

class ChartsHelperMethods {
  /// Method get [previousWeeksData] and [currentWeekData] as params
  /// All properties of current week is added in respective properties
  /// and then updated object is returned.
  static Map<String, dynamic> computeAllWeeksData(
      {required Map<String, dynamic> previousWeeksData,
      required Map<String, dynamic> currentWeekData}) {
    Map<String, dynamic> combinedWeeksData = previousWeeksData;
    combinedWeeksData['carryover_stories'] =
        List.from(previousWeeksData['carryover_stories'])
          ..addAll(currentWeekData['carryover_stories']);
    combinedWeeksData['prs_merged'] = List.from(previousWeeksData['prs_merged'])
      ..addAll(currentWeekData['prs_merged']);
    combinedWeeksData['new_stories_assigned'] =
        List.from(previousWeeksData['new_stories_assigned'])
          ..addAll(currentWeekData['new_stories_assigned']);
    combinedWeeksData['stories_completed'] =
        List.from(previousWeeksData['stories_completed'])
          ..addAll(currentWeekData['stories_completed']);
    combinedWeeksData['notable_comments'] =
        List.from(previousWeeksData['notable_comments'])
          ..addAll(currentWeekData['notable_comments']);
    combinedWeeksData['complexity'] += currentWeekData['complexity'];
    combinedWeeksData['story_deficit'] += currentWeekData['story_deficit'];
    if (combinedWeeksData['month'].isEmpty ||
        combinedWeeksData['employee'].length == 0) {
      combinedWeeksData['month'] = currentWeekData['month'];
      combinedWeeksData['employee'] = currentWeekData['employee'];
    }
    return combinedWeeksData;
  }

  /// This method returns the default week object for calculating all weeks data
  static Map<String, dynamic> getDefaultWeekObject() {
    return {
      'month': '',
      'employee': {},
      'carryover_stories': [],
      'complexity': 0,
      'new_stories_assigned': [],
      'notable_comments': [],
      'prs_merged': [],
      'stories_completed': [],
      'story_deficit': 0,
    };
  }

  /// Method will get [selectedProperty], [employeeName]
  /// and [weeksData] as params.
  /// Method will check the type of selectedProperty data
  /// If type would be List all weeks data would be merged into the response list
  /// else, it would add the previous value with current weeks value and returned.
  static calculateAllWeeksData({
    required Map<String, String> selectedPropertyMap,
    required String employeeName,
    required var weeksData,
  }) {
    List listResponse = [];
    double valueResponse = 0;
    String selectedProperty =
        HelperMethods.findPropertyKeyFromItem(selectedPropertyMap);
    for (var weekJson in weeksData) {
      Week week = Week.fromJson(weekJson);
      if (week.employee.name == employeeName) {
        var selectedPropertyData = findPropertyData(
          week: week,
          propertyName: selectedProperty,
        );
        if (selectedPropertyData is List) {
          listResponse = List.from(listResponse)..addAll(selectedPropertyData);
        } else {
          valueResponse += selectedPropertyData != null
              ? selectedPropertyData.toDouble()
              : 0;
        }
      }
    }
    return (findPropertyData(
      week: Week.fromJson(weeksData[0]),
      propertyName: selectedProperty,
    ) is List)
        ? listResponse
        : valueResponse;
  }

  static findPropertyData({
    required Week week,
    required String propertyName,
  }) {
    Map<String, dynamic> result = week.toJson();
    return result[propertyName];
  }
}
