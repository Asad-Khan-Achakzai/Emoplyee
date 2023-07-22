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
import 'package:flutter_bloc/flutter_bloc.dart';

// Constant imports
import '../../../../constants/sizes.dart';
import '../../../../constants/color_values.dart';
import '../../../../constants/values.dart';

// Components imports
import '../widgets/drop_down_widget.dart';
import '../widgets/setup_chart_data.dart';
import '../widgets/default_chart_detail_widget.dart';
import '../widgets/chart_details_widget.dart';
import '../widgets/bar_chart_widget.dart';
import '../../../../api/get_weekly_data.dart';
import '../../../../methods/helper_methods.dart';
import '../widgets/no_data_found_for_year.dart';
import '../methods/charts_helper_methods.dart';

// State Management imports
import '../../../../store/data_cubit.dart';

class PropertyChart extends StatefulWidget {
  const PropertyChart({Key? key}) : super(key: key);

  @override
  State<PropertyChart> createState() => PropertyChartState();

  // This is used for getting the context in case of change of item in Drop Down
  static PropertyChartState? of(BuildContext context) =>
      context.findAncestorStateOfType<PropertyChartState>();
}

class PropertyChartState extends State<PropertyChart> {
  late List<BarChartGroupData> rawBarGroups;
  late List<BarChartGroupData> barChartDataList;
  static List<String> monthsList = [];
  static List<String> weeksList = [Values.allweeks];
  static List<String> employeeNamesList = [];
  List<String> bottomTitlesList = [];
  bool isLoading = true;
  bool showChart = true;

  String selectedEmployee = '';
  set employee(String value) => setState(() => selectedEmployee = value);

  String selectedMonth = '';
  set month(String value) => setState(() => selectedMonth = value);

  String selectedWeek = '';
  set week(String value) => setState(() => selectedWeek = value);

  int selectedItemIndex = -1;
  set selectedItem(int value) => setState(() => selectedItemIndex = value);

  @override
  void initState() {
    super.initState();
    apiCallInitialization();
  }

  // Method will be used for calling API
  // Default Values of month, week and employee are used
  // In case of calling from initState() thse values will be empty
  // and below checks will ensure default values are set in the drop downs.
  // Incase of New Comment added, we will call API again for latest data
  // for that case, we would need to select the same values from drop down after API call
  void apiCallInitialization(
      {String month = '', String week = '', String employee = ''}) {
    var weeklyContext = BlocProvider.of<DataCubit>(context);

    getWeeklyData(month.isNotEmpty ? month : HelperMethods.findMonth(), context)
        .then((response) {
      weeklyContext.loadWeekData(response);

      if (weeklyContext.state['week']!.isNotEmpty) {
        for (var week in weeklyContext.state['week']!) {
          weeksList.add(week['week'].toString());
          employeeNamesList.add(week['employee']['name']);
        }

        if (month.isEmpty) {
          int monthRecordIndex =
              Values.months.indexOf(weeklyContext.state['week']![0]['month']);
          monthsList = Values.months.sublist(0, monthRecordIndex + 1);
        }

        List<String> uniqueWeeks = HelperMethods.dropdownItemsList(weeksList);

        // In case of notable comments added. API will be called again
        // and 3 optional params will be passed in case of comment added
        // They will ensure the UI will maintain it's state
        // For default case Last Month & Last Week will be displayed in UI

        setState(() {
          selectedMonth =
              month.isNotEmpty ? month : monthsList[monthsList.length - 1];
          selectedWeek = week.isNotEmpty ? week : uniqueWeeks[0];
          selectedEmployee =
              employee.isNotEmpty ? employee : employeeNamesList[0];
          isLoading = false;
        });
      } else {
        setState(() {
          showChart = false;
          isLoading = false;
        });
      }
    }).catchError((err) {
      HelperMethods.showErrorToast(context, err);
    });
  }

  // Method Gets the list of weeks and other monthly computations
  // and passed as (x,y) values to setupChartData(x,y)
  setupGroupIndex(dynamic week) {
    List<BarChartGroupData> response = [];

    if (week != null) {
      // Passing this list will help in displaying the value on top of each bar,
      // as Tooltip property needs a full list if we want to display on all bars.
      List<int> xAxisValues = List.generate(week.length, (index) {
        return index;
      });

      int xAxisValuesIndex = 0;
      List<String> bottomTitles = [];

      week.forEach((propertyKey, propertyValue) {
        if (propertyKey != 'year' &&
            propertyKey != '__v' &&
            (propertyValue is int ||
                propertyValue is double ||
                propertyValue is List)) {
          bottomTitles.add(propertyKey);
          response.add(
            setupChartData(
              xAxisValues[xAxisValuesIndex],
              propertyValue is List ? propertyValue.length : propertyValue,
              xAxisValues,
              selectedItemIndex,
            ),
          );
          xAxisValuesIndex++;
        }
      });
      setState(() {
        bottomTitlesList = bottomTitles;
      });
    }
    return response;
  }

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    var weeksData = BlocProvider.of<DataCubit>(context).state['week']!;
    var selectedWeekData = {};
    bool singleWeekSelected = false;
    Map<String, dynamic> allWeeksData = {};
    if (Values.weeksList.contains(selectedWeek)) {
      singleWeekSelected = true;
    } else {
      allWeeksData = ChartsHelperMethods.getDefaultWeekObject();
    }

    for (dynamic week in weeksData) {
      if (week['employee']['name'] == selectedEmployee &&
          week['month'] == selectedMonth) {
        if (singleWeekSelected) {
          if (week['week'] == selectedWeek) {
            selectedWeekData = week;
          }
        } else {
          allWeeksData = ChartsHelperMethods.computeAllWeeksData(
              previousWeeksData: allWeeksData, currentWeekData: week);
        }
      }
    }

    if (!singleWeekSelected) selectedWeekData = allWeeksData;

    final items = setupGroupIndex(selectedWeekData);
    rawBarGroups = items;
    barChartDataList = rawBarGroups;

    return Scaffold(
      backgroundColor: ColorValues.primary,
      body: !isLoading
          ? showChart
              ? Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Expanded(
                      flex: 3,
                      child: Container(
                        padding: EdgeInsets.symmetric(
                            horizontal: PaddingSize.charts),
                        child: Card(
                            color: ColorValues.secondary,
                            semanticContainer: true,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(15.0),
                            ),
                            child: SizedBox(
                              height:
                                  screenSize.height * Charts.chartWidgetHeight,
                              child: Column(
                                children: [
                                  Padding(
                                    padding: EdgeInsets.only(
                                        bottom: PaddingSize.dropDown),
                                    child: Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceAround,
                                      children: [
                                        DropDownWidget(
                                          itemsList:
                                              HelperMethods.dropdownItemsList(
                                                  monthsList),
                                          selectedValue: selectedMonth,
                                          callback: (val) {
                                            if (val != selectedMonth &&
                                                val !=
                                                    BlocProvider.of<DataCubit>(
                                                                context)
                                                            .state['week']![0]
                                                        ['month']) {
                                              setState(() => isLoading = true);
                                              apiCallInitialization(month: val);
                                              setState(
                                                  () => selectedMonth = val);
                                            }
                                          },
                                        ),
                                        DropDownWidget(
                                          itemsList:
                                              HelperMethods.dropdownItemsList(
                                                  weeksList),
                                          selectedValue: selectedWeek,
                                          callback: (val) => setState(
                                              () => selectedWeek = val),
                                        ),
                                        DropDownWidget(
                                          itemsList:
                                              HelperMethods.dropdownItemsList(
                                                  employeeNamesList),
                                          selectedValue: selectedEmployee,
                                          callback: (val) => setState(
                                              () => selectedEmployee = val),
                                        ),
                                      ],
                                    ),
                                  ),
                                  Expanded(
                                    child: Padding(
                                      padding:
                                          EdgeInsets.all(PaddingSize.charts),
                                      child: BarChartWidget(
                                        barChartDataList,
                                        bottomTitlesList,
                                        callback: (val) => setState(
                                            () => selectedItemIndex = val),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            )),
                      ),
                    ),
                    Expanded(
                      flex: 4,
                      child: selectedItemIndex == -1
                          ? const DefaultChartDetailWidget()
                          : DetailsWidget(
                              bottomTitlesList[selectedItemIndex],
                              selectedWeekData,
                              apiCallInitialization,
                              selectedIndexValue: (val) =>
                                  setState(() => selectedItemIndex = val),
                            ),
                    ),
                  ],
                )
              : const NoDataFoundForYear()
          : const Center(
              child: CircularProgressIndicator(),
            ),
    );
  }
}
