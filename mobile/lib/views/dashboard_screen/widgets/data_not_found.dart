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

// Flutter import
import 'package:flutter/material.dart';

// Constant imports
import '../../../constants/sizes.dart';
import '../../../constants/color_values.dart';

class DataNotFound extends StatefulWidget {
  final String title;
  final String subTitle;
  final IconData icon;
  final double iconSize;
  final Color iconColor;

  const DataNotFound(
      this.title, this.subTitle, this.icon, this.iconSize, this.iconColor,
      {Key? key})
      : super(key: key);

  @override
  State<DataNotFound> createState() => DataNotFoundState();
}

class DataNotFoundState extends State<DataNotFound> {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          IconButton(
            iconSize: widget.iconSize,
            onPressed: () => {},
            icon: Icon(
              widget.icon,
              color: widget.iconColor,
            ),
          ),
          Text(
            widget.title,
            textAlign: TextAlign.center,
            style: TextStyle(
              color: ColorValues.primaryTextColor,
              fontSize: FontSize.text,
            ),
          ),
          Text(
            widget.subTitle,
            textAlign: TextAlign.center,
            style: TextStyle(
              color: ColorValues.secondaryTextColor,
              fontSize: FontSize.text,
            ),
          ),
        ],
      ),
    );
  }
}
