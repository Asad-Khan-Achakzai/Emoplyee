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
import 'package:heimdall/constants/assets.dart';
import 'package:heimdall/constants/sizes.dart';
import 'package:heimdall/constants/color_values.dart';
import 'package:heimdall/constants/toast_messages.dart';
import 'package:heimdall/constants/values.dart';

// Component imports
import 'package:heimdall/api/invite_user.dart';
import 'package:heimdall/methods/helper_methods.dart';
import 'package:heimdall/views/bottom_tabs/tabs/widgets/drop_down_widget.dart';

class InviteUser extends StatefulWidget {
  final String projectId;
  final Function callGetProjectDetailsApi;
  const InviteUser(this.projectId, this.callGetProjectDetailsApi, {Key? key})
      : super(key: key);

  @override
  State<InviteUser> createState() => InviteUserState();
}

class InviteUserState extends State<InviteUser> {
  TextEditingController inviteEmail = TextEditingController();
  String selectedUserRole = Values.user;

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        TextField(
          style: TextStyle(
            color: ColorValues.secondary,
          ),
          controller: inviteEmail,
          decoration: InputDecoration(
            label: Text(Values.enterEmail),
            labelStyle: TextStyle(
              color: ColorValues.secondaryTextColor,
            ),
            border: const UnderlineInputBorder(),
          ),
        ),
        DropDownWidget(
          isExpanded: true,
          itemsList: [Values.user, Values.projectManager, Values.admin],
          selectedValue: selectedUserRole,
          color: ColorValues.primary,
          backgroundColor: ColorValues.primaryTextColor.withOpacity(0.8),
          callback: (val) {
            setState(() {
              selectedUserRole = val;
            });
          },
        ),
        ElevatedButton(
          style: ButtonStyle(
            backgroundColor:
                MaterialStateProperty.all(ColorValues.primary.withOpacity(0.8)),
          ),
          onPressed: () {
            if (inviteEmail.text.isNotEmpty) {
              Navigator.pop(context);
              inviteUser(
                widget.projectId,
                inviteEmail.text,
                HelperMethods.findProject(context).name,
                context,
                selectedUserRole,
              ).then((response) {
                if (response) {
                  inviteEmail.clear();
                  widget.callGetProjectDetailsApi();
                  HelperMethods.showToastMessage(
                    context: context,
                    message: ToastMessages.invitationSuccessful,
                  );
                }
              }).catchError((err) {
                HelperMethods.showToastMessage(
                  context: context,
                  message: ToastMessages.invitationFailed,
                );
              });
            }
          },
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Padding(
                padding: const EdgeInsets.only(right: 6),
                child: Icon(
                  IconsList.inviteUserIcon,
                  size: 20,
                ),
              ),
              Text(
                Values.inviteMember,
                style: TextStyle(
                  color: ColorValues.primaryTextColor,
                  fontSize: FontSize.smallText,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
