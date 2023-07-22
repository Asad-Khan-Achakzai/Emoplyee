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

class CustomDialogBox {
  static Future<void> showDialogBox({
    required BuildContext context,
    required String title,
    String? description,
    bool? isDismissible,
    Widget? customWidget,
    String? actionButtonTitle,
    String? secondActionButtonTitle,
    VoidCallback? onActionButtonPressed,
    VoidCallback? onSecondActionButtonPressed,
  }) {
    return showDialog<void>(
      context: context,
      barrierDismissible: isDismissible ?? true,
      builder: (BuildContext context) => AlertDialog(
        title: Text(title),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (description != null) Text(description),
            customWidget!,
          ],
        ),
        actions: actionButtonTitle != null
            ? <Widget>[
                TextButton(
                  onPressed: () {
                    if (onSecondActionButtonPressed != null) {
                      onSecondActionButtonPressed();
                    }
                    Navigator.pop(context);
                  },
                  child: Text(secondActionButtonTitle ?? Values.cancel),
                ),
                TextButton(
                  onPressed: () {
                    if (onActionButtonPressed != null) {
                      onActionButtonPressed();
                    }
                    Navigator.pop(context);
                  },
                  child: Text(actionButtonTitle),
                ),
              ]
            : [],
      ),
    );
  }
}
