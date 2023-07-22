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
import '../../../../constants/assets.dart';
import '../../../../constants/color_values.dart';
import '../../../../constants/values.dart';
import '../../../../constants/sizes.dart';

class NoDataFoundForYear extends StatelessWidget {
  const NoDataFoundForYear({
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        IconButton(
          iconSize: IconSize.huge,
          onPressed: () => {},
          icon: Icon(
            IconsList.errorIcon,
            color: ColorValues.error,
          ),
        ),
        Text(
          '${Values.noDataFound} ${DateTime.now().year}',
          textAlign: TextAlign.center,
          style: TextStyle(
            color: ColorValues.primaryTextColor,
            fontSize: FontSize.text,
          ),
        ),
      ],
    );
  }
}
