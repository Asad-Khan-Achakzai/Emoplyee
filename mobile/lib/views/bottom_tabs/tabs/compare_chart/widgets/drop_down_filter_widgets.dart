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
import 'package:heimdall/constants/sizes.dart';

// Constant imports
import '../../../../../constants/color_values.dart';

// Component imports
import '../../widgets/drop_down_widget.dart';
import '../../../../../methods/helper_methods.dart';

class DropDownFilterWidget extends StatefulWidget {
  final String filterLabel;
  final List<String> itemsList;
  final String selectedItem;
  final Function callback;

  const DropDownFilterWidget(
      this.filterLabel, this.itemsList, this.selectedItem, this.callback,
      {Key? key})
      : super(key: key);

  @override
  State<DropDownFilterWidget> createState() => DropDownFilterWidgetState();
}

class DropDownFilterWidgetState extends State<DropDownFilterWidget> {
  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Text(
          '${widget.filterLabel}:',
          style: TextStyle(
            color: ColorValues.secondaryTextColor,
          ),
        ),
        Padding(
          padding: EdgeInsets.symmetric(
              horizontal: PaddingSize.dropDownFiltersHorizontal),
          child: DropDownWidget(
            itemsList: HelperMethods.dropdownItemsList(widget.itemsList),
            selectedValue: widget.selectedItem,
            callback: widget.callback,
            color: ColorValues.primaryTextColor,
            backgroundColor: ColorValues.primary,
            compareChart: true,
          ),
        ),
      ],
    );
  }
}
