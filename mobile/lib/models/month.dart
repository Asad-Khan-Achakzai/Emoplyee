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

import './employee.dart';

class Month {
  final int id;
  final String month;
  final int totalStoryPoints;
  final int totalPRsMerged;
  final int epics; // projects
  final double ttrRatio; // time to resolution ratio
  final double sprintVelocity;
  final Employee employee;

  const Month(
      {required this.id,
      this.month = '',
      this.totalStoryPoints = 0,
      this.totalPRsMerged = 0,
      this.epics = 0,
      this.ttrRatio = 0,
      this.sprintVelocity = 0,
      this.employee = const Employee(id: '0')});
}
