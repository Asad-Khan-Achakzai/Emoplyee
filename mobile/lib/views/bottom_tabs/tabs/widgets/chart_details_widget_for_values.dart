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

// Constant imports
import '../../../../constants/values.dart';

// Component imports
import './item_detail_widget.dart';

class ChartDetailsWidgetForValues extends StatelessWidget {
  final Map<String, dynamic> detailsList;
  final String title;

  const ChartDetailsWidgetForValues(
    this.detailsList,
    this.title, {
    Key? key,
  }) : super(key: key);

  String refactorWeekName(String weekName) {
    return weekName[weekName.length - 1];
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 10.0),
      child: Column(
        children: [
          ItemDetailWidget(Values.count, detailsList[title].toString()),
          ItemDetailWidget(Values.engineer, detailsList['employee']['name']),
          ItemDetailWidget(
              Values.month, Values.monthsList[detailsList['month']].toString()),
          if (detailsList['week'] != null)
            ItemDetailWidget('Week', refactorWeekName(detailsList['week'])),
        ],
      ),
    );
  }
}
