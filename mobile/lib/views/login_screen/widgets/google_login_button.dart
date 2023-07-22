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
import 'package:heimdall/constants/color_values.dart';
import 'package:heimdall/constants/assets.dart';
import 'package:heimdall/constants/sizes.dart';
import 'package:heimdall/constants/values.dart';

// Component imports
import 'package:heimdall/views/dashboard_screen/dashboard_screen.dart';
import 'package:heimdall/api/login_api.dart';
import 'package:heimdall/methods/helper_methods.dart';

class GoogleLoginButton extends StatelessWidget {
  const GoogleLoginButton({
    Key? key,
  }) : super(key: key);

  handleGoogleLogin(context) {
    loginApi().then((apiResponse) {
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(
          builder: (BuildContext context) => DashboardScreen(
            apiResponse['user'],
            apiResponse['projectList'],
            apiResponse['jwtToken'],
          ),
        ),
      );
    }).catchError((err) {
      HelperMethods.showErrorToast(context, Values.signInFailed);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(
          vertical: PaddingSize.vertical, horizontal: PaddingSize.horizontal),
      child: ElevatedButton(
        style: ButtonStyle(
          padding: MaterialStateProperty.all<EdgeInsets>(
            EdgeInsets.symmetric(vertical: PaddingSize.button),
          ),
          backgroundColor:
              MaterialStateProperty.all<Color>(ColorValues.primaryTextColor),
          shape: MaterialStateProperty.all<RoundedRectangleBorder>(
            RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(CustomSize.circularRadius),
            ),
          ),
        ),
        onPressed: () => handleGoogleLogin(context),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Padding(
              padding: EdgeInsets.only(right: PaddingSize.button),
              child: Image(
                color: ColorValues.primary,
                width: CustomSize.buttonLogoWidth,
                height: CustomSize.buttonLogoHeight,
                image: AssetImage(Images.googleLogo),
              ),
            ),
            Text(
              Values.loginWithGoogle,
              style: TextStyle(
                  color: ColorValues.primary, fontSize: FontSize.button),
            ),
          ],
        ),
      ),
    );
  }
}
