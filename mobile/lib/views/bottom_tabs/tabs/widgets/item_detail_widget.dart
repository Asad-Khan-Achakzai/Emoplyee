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
import '../../../../constants/sizes.dart';
import '../../../../constants/color_values.dart';

class ItemDetailWidget extends StatelessWidget {
  final String title;
  final String value;
  const ItemDetailWidget(
    this.title,
    this.value, {
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;

    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              title,
              style: TextStyle(
                color: ColorValues.secondary,
                fontSize: FontSize.smallText,
              ),
            ),
            Text(
              value,
              style: TextStyle(
                color: ColorValues.secondary,
                fontSize: FontSize.smallText,
                fontWeight: FontWeight.w400,
              ),
            ),
          ],
        ),
        Divider(
          height: CustomSize.dividerSize,
          thickness: 0.1,
          indent: screenSize.width * PaddingSize.twoPercentPadding,
          endIndent: screenSize.width * PaddingSize.twoPercentPadding,
          color: ColorValues.primary,
        ),
      ],
    );
  }
}
