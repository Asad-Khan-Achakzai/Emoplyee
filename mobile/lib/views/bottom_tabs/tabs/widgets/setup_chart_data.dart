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

// 3rd Party imports
import 'package:fl_chart/fl_chart.dart';

// Constant imports
import '../../../../../constants/color_values.dart';
import '../../../../../constants/sizes.dart';

// Component imports
import '../../../../methods/helper_methods.dart';

// Method accepts values as (x,y) pairs
// and maps those values to plot Bar Chart
BarChartGroupData setupChartData(
  int xAxisValue,
  yAxisValue,
  List<int> xAxisValuesList,
  int selectedIndex, {
  double employee2yAxisValue = -1,
}) {
  return BarChartGroupData(
    x: xAxisValue,
    barRods: [
      BarChartRodData(
        toY: yAxisValue.toDouble(),
        gradient: selectedIndex != xAxisValue
            ? HelperMethods.linearGradientColors(ColorValues.chartPrimaryColor,
                ColorValues.chartSecondaryColor, 0.2, 0.8)
            :
            // Highlight the Selected Bar
            HelperMethods.linearGradientColors(ColorValues.primaryTextColor,
                ColorValues.primaryTextColor.withOpacity(0.1), 0.8, 0.5),
        width: Charts.barsWidth,
      ),
      if (employee2yAxisValue > -1)
        BarChartRodData(
          toY: employee2yAxisValue,
          gradient: HelperMethods.linearGradientColors(
              ColorValues.comparisonChartPrimaryColor,
              ColorValues.comparisonChartSecondaryColor,
              0.9,
              0.1),
          width: Charts.barsWidth,
        ),
    ],

    // Passing a list of Int values to show tooltip on all bars
    showingTooltipIndicators: xAxisValuesList,
  );
}
