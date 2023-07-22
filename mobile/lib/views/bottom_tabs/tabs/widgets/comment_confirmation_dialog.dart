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
import 'dart:convert';

import 'package:flutter/material.dart';

// 3rd party imports
import 'package:flutter_bloc/flutter_bloc.dart';

// Component imports
import 'package:heimdall/api/add_new_comment.dart';
import 'package:heimdall/methods/helper_methods.dart';

// Constant imports
import 'package:heimdall/constants/assets.dart';
import 'package:heimdall/constants/values.dart';

// State Management imports
import 'package:heimdall/store/logged_in_user.dart';

class CommentConfirmationDialog extends StatefulWidget {
  final Map<String, dynamic> itemsList;
  final TextEditingController newComment;
  final Function apiCall;

  const CommentConfirmationDialog(this.itemsList, this.newComment, this.apiCall,
      {Key? key})
      : super(key: key);

  @override
  State<CommentConfirmationDialog> createState() =>
      _CommentConfirmationDialogState();
}

class _CommentConfirmationDialogState extends State<CommentConfirmationDialog> {
  // Method will return current logged in user
  findLoggedInUser() {
    var userContext = BlocProvider.of<LoggedInUser>(context);
    var user = (userContext.state);
    Map<String, dynamic> employeeObject = jsonDecode(jsonEncode(user));
    return employeeObject['name'];
  }

  // Method will return the current system date
  findCurrentDate() {
    final currentDate = DateTime.now();
    return '${currentDate.day}-${currentDate.month}-${currentDate.year}';
  }

  // Method will append the Comment with name of current user and date
  // e.g. Test Comment. => Test Comment. - by Aqib Naveed on 02-08-2022
  String appendCommentWithUserName() {
    String comment = widget.newComment.text;
    var fullComment =
        '${comment.trim()} - by ${findLoggedInUser()} on ${findCurrentDate()}';
    return fullComment;
  }

  @override
  Widget build(BuildContext context) {
    return IconButton(
      onPressed: () => widget.newComment.text.trim().isEmpty
          ? null
          : showDialog<String>(
              context: context,
              builder: (BuildContext context) => AlertDialog(
                title: Text(Values.confirmation),
                content: Text(appendCommentWithUserName()),
                actions: <Widget>[
                  TextButton(
                    onPressed: () => Navigator.pop(context),
                    child: Text(Values.cancel),
                  ),
                  TextButton(
                    onPressed: () {
                      if (widget.newComment.text.trim().isNotEmpty) {
                        addNewComment(widget.itemsList['_id'],
                                appendCommentWithUserName(), context)
                            .then((response) {
                          widget.newComment.clear();
                          widget.apiCall(
                            employee: widget.itemsList['employee']['name'],
                            week: widget.itemsList['week'],
                            month: widget.itemsList['month'],
                          );
                          Navigator.pop(context);
                        }).catchError((err) {
                          HelperMethods.showErrorToast(context, err);
                        });
                      }
                    },
                    child: Text(Values.send),
                  ),
                ],
              ),
            ),
      icon: Icon(
        IconsList.sendCommentIcon,
      ),
    );
  }
}
