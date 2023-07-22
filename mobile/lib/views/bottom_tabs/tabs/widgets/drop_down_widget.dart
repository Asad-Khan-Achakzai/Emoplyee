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

// Component imports
import './drop_down_button.dart';

class DropDownWidget extends StatefulWidget {
  final List<String> itemsList;
  final Function callback;
  final String selectedValue;
  final Color? color;
  final Color? backgroundColor;
  final bool? compareChart;
  final bool? isExpanded;
  final Alignment? alignment;
  final bool disable;

  const DropDownWidget({
    Key? key,
    required this.itemsList,
    required this.callback,
    required this.selectedValue,
    this.color,
    this.backgroundColor,
    this.compareChart,
    this.isExpanded,
    this.alignment,
    this.disable = false,
  }) : super(key: key);

  @override
  State<DropDownWidget> createState() => _DropDownWidgetState();
}

class _DropDownWidgetState extends State<DropDownWidget> {
  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;

    return (widget.compareChart != null && widget.compareChart == true)
        ? SizedBox(
            width: screenSize.width * CustomSize.dropDownWidthForComparisons,
            child: DropDownButton(
              itemsList: widget.itemsList,
              callback: widget.callback,
              selectedValue: widget.selectedValue,
              color: widget.color,
              backgroundColor: widget.backgroundColor,
              isExpanded: widget.compareChart,
              disable: widget.disable,
            ),
          )
        : Container(
            alignment: widget.alignment ?? Alignment.bottomLeft,
            child: DropDownButton(
              itemsList: widget.itemsList,
              callback: widget.callback,
              selectedValue: widget.selectedValue,
              color: widget.color,
              backgroundColor: widget.backgroundColor,
              isExpanded: widget.isExpanded,
              disable: widget.disable,
            ),
          );
  }
}
