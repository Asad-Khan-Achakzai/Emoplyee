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
import 'package:heimdall/constants/values.dart';
import 'package:heimdall/constants/color_values.dart';
import 'package:heimdall/constants/assets.dart';
import 'package:heimdall/constants/sizes.dart';
import 'package:heimdall/constants/toast_messages.dart';

// Component imports
import 'package:heimdall/methods/helper_methods.dart';

class ProjectFields extends StatefulWidget {
  final String name;
  final String url;
  final String description;
  final Function onPressed;
  final String action;
  final IconData? icon;
  final String eventSuccessMessage;
  final String eventFailureMessage;

  const ProjectFields({
    this.name = '',
    this.url = '',
    this.description = '',
    required this.onPressed,
    required this.action,
    this.icon,
    Key? key,
    required this.eventSuccessMessage,
    required this.eventFailureMessage,
  }) : super(key: key);

  @override
  State<ProjectFields> createState() => ProjectFieldsState();
}

class ProjectFieldsState extends State<ProjectFields> {
  final TextEditingController projectName = TextEditingController();
  final TextEditingController projectUrl = TextEditingController();
  final TextEditingController projectDescription = TextEditingController();

  @override
  void initState() {
    super.initState();
    projectName.text = widget.name;
    projectUrl.text = widget.url;
    projectDescription.text = widget.description;
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        children: [
          TextField(
            style: TextStyle(
              color: ColorValues.secondary,
            ),
            controller: projectName,
            decoration: InputDecoration(
              label: Text(Values.projectName),
              labelStyle: TextStyle(
                color: ColorValues.secondaryTextColor,
              ),
              border: const UnderlineInputBorder(),
            ),
          ),
          TextField(
            style: TextStyle(
              color: ColorValues.secondary,
            ),
            controller: projectUrl,
            decoration: InputDecoration(
              label: Text(Values.projectUrl),
              labelStyle: TextStyle(
                color: ColorValues.secondaryTextColor,
              ),
              border: const UnderlineInputBorder(),
            ),
          ),
          TextField(
            style: TextStyle(
              color: ColorValues.secondary,
            ),
            controller: projectDescription,
            decoration: InputDecoration(
              label: Text(Values.projectDescription),
              labelStyle: TextStyle(
                color: ColorValues.secondaryTextColor,
              ),
              border: const UnderlineInputBorder(),
            ),
          ),
          ElevatedButton(
            style: ButtonStyle(
              backgroundColor: MaterialStateProperty.all(
                  ColorValues.primary.withOpacity(0.8)),
            ),
            onPressed: () {
              widget
                  .onPressed(
                context: context,
                name: projectName.text,
                description: projectDescription.text,
                fileUrl: projectUrl.text,
              )
                  .then((response) {
                print(response);
                if (response == true) {
                  projectName.clear();
                  projectDescription.clear();
                  projectUrl.clear();
                  Navigator.pop(context);
                  HelperMethods.showToastMessage(
                    context: context,
                    message: widget.eventSuccessMessage,
                  );
                } else {
                  response['data']['keyPattern'].forEach((key, value) {
                    HelperMethods.showToastMessage(
                      context: context,
                      message: ToastMessages.duplicateProjectField('key'),
                      backgroundColor: ColorValues.error,
                    );
                  });
                }
              }).catchError((err) {
                HelperMethods.showToastMessage(
                  context: context,
                  message: widget.eventFailureMessage,
                  backgroundColor: ColorValues.error,
                );
              });
            },
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                if (widget.icon != null)
                  Padding(
                    padding: EdgeInsets.only(right: PaddingSize.iconPadding),
                    child: Icon(
                      widget.icon,
                      size: IconSize.small,
                    ),
                  ),
                Text(
                  widget.action,
                  style: TextStyle(
                    color: ColorValues.primaryTextColor,
                    fontSize: FontSize.smallText,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
