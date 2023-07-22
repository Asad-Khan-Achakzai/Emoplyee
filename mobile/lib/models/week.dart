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
import './user_story.dart';
import './employee.dart';

class Week {
  final String id;
  final String week;
  final String month;
  final String startDate;
  final String endDate;
  final Employee employee;
  final List<UserStory> prMerged;
  final List<UserStory> carryOverStories;
  final List<UserStory> newStoriesAssigned;
  final List<UserStory> storiesCompleted;
  final List<String> notableComments;
  final int storyDeficit;
  final double complexity;

  const Week(
      {required this.id,
      this.week = '',
      this.month = '',
      this.startDate = '',
      this.endDate = '',
      this.employee = const Employee(id: '0'),
      this.prMerged = const [],
      this.carryOverStories = const [],
      this.newStoriesAssigned = const [],
      this.storiesCompleted = const [],
      this.notableComments = const [],
      this.storyDeficit = 0,
      this.complexity = 0});

  // Method gets the list of json List
  // It will convert the input into List<UserStories>
  static List<UserStory> convertUserStoryJsonToModel(
    List<dynamic> membersJson,
  ) {
    List<UserStory> userStoriesList = [];
    for (Map<String, dynamic> member in membersJson) {
      userStoriesList.add(UserStory.fromJson(member));
    }
    return userStoriesList;
  }

  // Method gets the [List<UserStory>]
  // It will convert the input into [List<Map<String, dynamic>>]
  static convertUserStoryModelToJson(List<UserStory> userStoriesList) {
    List<Map<String, dynamic>> jsonList = [];
    for (UserStory userStory in userStoriesList) {
      jsonList.add(userStory.toJson());
    }
    return jsonList;
  }

  Week.fromJson(Map<String, dynamic> json)
      : id = json['_id'],
        week = json['week'],
        month = json['month'],
        startDate = json['start_date'],
        endDate = json['end_date'],
        notableComments = List<String>.from(json['notable_comments']),
        employee = Employee.fromJson(json['employee']),
        prMerged = convertUserStoryJsonToModel(json['prs_merged']),
        carryOverStories =
            convertUserStoryJsonToModel(json['carryover_stories']),
        newStoriesAssigned =
            convertUserStoryJsonToModel(json['new_stories_assigned']),
        storiesCompleted =
            convertUserStoryJsonToModel(json['stories_completed']),
        storyDeficit = json['story_deficit'],
        complexity = json['complexity'].toDouble() ?? 0;

  Map<String, dynamic> toJson() => {
        '_id': id,
        'week': week,
        'month': month,
        'start_date': startDate,
        'end_date': endDate,
        'notable_comments': notableComments,
        'employee': employee,
        'prs_merged': convertUserStoryModelToJson(prMerged),
        'carryover_stories': convertUserStoryModelToJson(carryOverStories),
        'new_stories_assigned': convertUserStoryModelToJson(newStoriesAssigned),
        'stories_completed': convertUserStoryModelToJson(storiesCompleted),
        'story_deficit': storyDeficit,
        'complexity': complexity,
      };
}
