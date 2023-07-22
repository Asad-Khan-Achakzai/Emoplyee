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
import '../../constants/values.dart';
import '../../constants/assets.dart';
import '../../constants/sizes.dart';
import '../../constants/color_values.dart';

// Component imports
import './widgets/google_login_button.dart';
import '../../methods/helper_methods.dart';

class LoginScreen extends StatefulWidget {
  final bool isLoading;
  const LoginScreen({
    required this.isLoading,
    Key? key,
  }) : super(key: key);

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  bool isLoading = true;
  @override
  void initState() {
    isLoading = widget.isLoading;
    super.initState();

    if (widget.isLoading) {
      HelperMethods.navigateToInitialScreen(
        context,
        () => isLoading = false,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          image: DecorationImage(
            image: AssetImage(Images.loginBackground),
            fit: BoxFit.cover,
            colorFilter: ColorFilter.mode(
                ColorValues.primary.withOpacity(CustomSize.imageFilterOpacity),
                BlendMode.darken),
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              Values.appName,
              style: TextStyle(
                  color: ColorValues.primaryTextColor,
                  fontWeight: FontWeight.bold,
                  fontSize: FontSize.appTitle),
            ),
            Divider(
              height: CustomSize.dividerSize,
              thickness: CustomSize.lineThickness,
              indent: screenSize.width * PaddingSize.tenPercentPadding,
              endIndent: screenSize.width * PaddingSize.tenPercentPadding,
              color: ColorValues.loginPageContrastColor,
            ),
            Padding(
              padding: EdgeInsets.symmetric(
                horizontal: PaddingSize.horizontal,
                vertical: PaddingSize.vertical,
              ),
              child: Text(
                Values.appDescription,
                maxLines: CustomSize.descriptionLines,
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: ColorValues.primaryTextColor,
                  fontSize: FontSize.text,
                ),
              ),
            ),
            !isLoading
                ? const GoogleLoginButton()
                : const CircularProgressIndicator(),
          ],
        ),
      ),
    );
  }
}
