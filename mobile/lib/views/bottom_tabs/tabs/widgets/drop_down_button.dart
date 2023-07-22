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

// Constants imports
import '../../../../constants/color_values.dart';
import '../../../../constants/sizes.dart';
import '../../../../constants/assets.dart';

class DropDownButton extends StatelessWidget {
  final List<String> itemsList;
  final Function callback;
  final String selectedValue;
  final Color? color;
  final Color? backgroundColor;
  final bool? isExpanded;
  final bool disable;

  const DropDownButton({
    Key? key,
    required this.itemsList,
    required this.callback,
    required this.selectedValue,
    this.color,
    this.backgroundColor,
    this.isExpanded,
    this.disable = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return DropdownButton<String>(
      isExpanded: isExpanded ?? false,
      dropdownColor: (backgroundColor ?? ColorValues.primary).withOpacity(0.75),
      alignment: AlignmentDirectional.bottomEnd,
      value: selectedValue,
      icon: Icon(
        IconsList.dropDownIcon,
        color: color ??
            (disable
                ? ColorValues.primaryTextColor.withOpacity(0.8)
                : ColorValues.primaryTextColor),
        textDirection: TextDirection.rtl,
      ),
      elevation: CustomSize.dropDownElevation,
      style: TextStyle(
        color: color ?? ColorValues.primaryTextColor,
      ),
      underline: Divider(
        color: ColorValues.secondaryTextColor,
        thickness: CustomSize.dropDownThickness,
        height: CustomSize.dropDownHeight,
      ),
      onChanged: disable
          ? null
          : (String? newValue) {
              callback(newValue);
            },
      items: itemsList.map<DropdownMenuItem<String>>((String value) {
        return DropdownMenuItem<String>(
          enabled: !disable,
          value: value,
          child: Text(
            value,
            style: TextStyle(
                color: disable
                    ? ColorValues.primaryTextColor.withOpacity(0.8)
                    : color ?? ColorValues.primaryTextColor),
          ),
        );
      }).toList(),
    );
  }
}
