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
import '../../constants/assets.dart';
import '../../constants/color_values.dart';
import '../../constants/sizes.dart';

// Component imports
import '../../methods/helper_methods.dart';
import '../../api/login_with_google_api.dart';

class AppBarWidget extends StatelessWidget with PreferredSizeWidget {
  final String title;
  final bool leadingIcon;
  const AppBarWidget(
    this.title, {
    Key? key,
    this.leadingIcon = true,
  }) : super(key: key);

  @override
  Size get preferredSize => Size.fromHeight(CustomSize.appBarHeight);

  @override
  PreferredSizeWidget build(BuildContext context) {
    return AppBar(
      title: Text(title),
      backgroundColor: ColorValues.primary,
      automaticallyImplyLeading: leadingIcon,
      actions: [
        Row(
          children: [
            Padding(
              padding: const EdgeInsets.only(right: 8),
              child: Container(
                width: CustomSize.appBarAvatarWidth,
                height: CustomSize.appBarAvatarHeight,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  image: DecorationImage(
                    image: HelperMethods.loadProfileAvatar(
                        HelperMethods.findLoggedInUser(context).picture),
                    fit: BoxFit.fill,
                  ),
                ),
              ),
            ),
            Text(
              HelperMethods.findLoggedInUser(context).name.split(' ')[0],
            ),
          ],
        ),
        IconButton(
          icon: Icon(
            IconsList.logoutIcon,
            size: IconSize.small,
          ),
          onPressed: () {
            logOutUser().then((response) {
              HelperMethods.navigateToLoginScreen(context);
            });
          },
        ),
      ],
    );
  }
}
