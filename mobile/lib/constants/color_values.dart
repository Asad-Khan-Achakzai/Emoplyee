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

class ColorValues {
  // Used for Backgrounds
  static Color primary = Colors.black87;
  static Color secondary = const Color(0xff2c4260);

  // Used for writing text above backgrounds
  static Color primaryTextColor = Colors.white;
  static Color secondaryTextColor = const Color(0xff8c939c);

  static Color loginPageContrastColor = const Color(0xff02d39a);

  // Used for Gradients in Bar Chart & as alternate colors in Pie Chart
  static Color chartPrimaryColor = const Color(0xff23b6e6);
  static Color chartSecondaryColor = const Color(0xff02d39a);

  // Used for Gradients in Comparison Bar Chart
  static Color comparisonChartPrimaryColor = const Color(0xffa067d8);
  static Color comparisonChartSecondaryColor = const Color(0xff6094ea);

  // Color for Errors
  static Color error = Colors.red;

  // Transparent Color - used for cancelling the default color of Bar Chart tooltip item
  static Color transparentColor = Colors.transparent;
}
