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

// 3rd party imports
import 'package:fl_chart/fl_chart.dart';

// Constants imports
import '../../../../constants/color_values.dart';
import '../../../../constants/sizes.dart';

class BarChartWidget extends StatefulWidget {
  final List<BarChartGroupData> barChartDataList;
  final List<String> valuesList;
  final Function callback;
  final bool? employeeChart;
  final bool? compareChart;

  const BarChartWidget(
    this.barChartDataList,
    this.valuesList, {
    Key? key,
    this.employeeChart,
    this.compareChart,
    required this.callback,
  }) : super(key: key);

  @override
  State<BarChartWidget> createState() => _BarChartWidgetState();
}

class _BarChartWidgetState extends State<BarChartWidget> {
  // Method will convert the keys coming from APIs
  // to Readable labels. i.e., initials of each letter
  // e.g. stories_deficit => SD
  String refactorPropertyToLabel(String label) {
    String response = '';

    // In case of Employee names, First name would be mandatory to show
    if (widget.employeeChart != null) {
      response = label.split(' ')[0];
      response = response[0].toUpperCase() + response.substring(1);
    } else {
      List<String> labelsList = label.split('_');

      // Incase of ttr_ratio, prs_merged and total_prs_merged
      // Below checks will ensure better labels
      if (label.contains('ttr')) {
        response = 'TTR';
      } else if (label.contains('prs')) {
        response = 'PR';
      } else {
        for (String element in labelsList) {
          response += element[0].toUpperCase();
        }

        // In case of single word property, this method will ensure a better label
        // e.g. complexity => Comp
        if (response.length < 2) {
          response = label[0].toUpperCase();
          response += label.substring(1, 4);
        }
      }
    }
    return response;
  }

  @override
  Widget build(BuildContext context) {
    return BarChart(
      // TODO: Will discuss with Umair for refactoring later
      BarChartData(
        barTouchData: BarTouchData(
          touchCallback: (FlTouchEvent event, BarTouchResponse? touchResponse) {
            if (touchResponse != null && touchResponse.spot != null) {
              widget.callback(touchResponse.spot!.touchedBarGroupIndex);
              return;
            }
          },
          touchTooltipData: BarTouchTooltipData(
            tooltipBgColor: ColorValues.transparentColor,
            tooltipMargin: CustomSize.zero,
            getTooltipItem: (
              BarChartGroupData group,
              int groupIndex,
              BarChartRodData rod,
              int rodIndex,
            ) {
              return BarTooltipItem(
                rod.toY.toStringAsFixed(0),
                TextStyle(
                  color: ColorValues.primaryTextColor,
                  fontWeight: FontWeight.bold,
                ),
              );
            },
          ),
        ),
        titlesData: FlTitlesData(
          rightTitles: AxisTitles(),
          topTitles: AxisTitles(),
          bottomTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              getTitlesWidget: (double value, TitleMeta meta) {
                return Padding(
                  padding:
                      EdgeInsets.only(top: PaddingSize.barChartBottomTitles),
                  child: Text(
                    refactorPropertyToLabel(widget.valuesList[value.toInt()]),
                    style: TextStyle(
                      color: ColorValues.secondaryTextColor,
                      fontSize: FontSize.chartBottomTitles,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                );
              },
            ),
          ),
          leftTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: widget.compareChart != null ? true : false,
              interval: CustomSize.chartTitlesInterval,
              getTitlesWidget: (double value, TitleMeta meta) {
                return SideTitleWidget(
                  axisSide: meta.axisSide,
                  child: Text(
                    value.toStringAsFixed(0),
                    style: TextStyle(
                      color: ColorValues.secondaryTextColor,
                      fontWeight: FontWeight.bold,
                      fontSize: FontSize.comparisonChartLeftTitles,
                    ),
                  ),
                );
              },
            ),
          ),
        ),
        borderData: FlBorderData(
          show: false,
        ),
        barGroups: widget.barChartDataList,
        gridData: FlGridData(
          show: false,
          drawVerticalLine: false,
        ),
      ),
    );
  }
}
