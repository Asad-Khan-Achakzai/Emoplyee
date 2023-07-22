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
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:expandable/expandable.dart';
import 'package:fl_chart/fl_chart.dart';

// Constant imports
import '../../../../constants/assets.dart';
import '../../../../constants/sizes.dart';
import '../../../../constants/color_values.dart';
import '../../../../constants/values.dart';

// Components imports
import '../../../../api/get_weekly_data.dart';
import '../../../../methods/helper_methods.dart';
import '../compare_chart/widgets/drop_down_filter_widgets.dart';
import '../widgets/bar_chart_widget.dart';
import '../widgets/no_data_found_for_year.dart';
import '../widgets/setup_chart_data.dart';

// State Management imports
import '../../../../store/data_cubit.dart';

class CompareChart extends StatefulWidget {
  const CompareChart({Key? key}) : super(key: key);

  @override
  State<CompareChart> createState() => CompareChartState();

  // This is used for getting the context in case of change of items in drop-down
  static CompareChartState? of(BuildContext context) =>
      context.findAncestorStateOfType<CompareChartState>();
}

class CompareChartState extends State<CompareChart> {
  late List<BarChartGroupData> rawBarGroups;
  late List<BarChartGroupData> barChartDataList;
  static List<String> monthsList = [];
  static List<String> weeksList = [];
  static List<String> employeeNamesList = [];
  List<String> bottomTitlesList = [];
  bool isLoading = true;
  bool showChart = false;
  bool showComparison = true;
  bool filterExpandableStatus = false;

  String selectedEmployee1 = '';
  set employee1(String value) => setState(() => selectedEmployee1 = value);

  String selectedEmployee2 = '';
  set employee2(String value) => setState(() => selectedEmployee2 = value);

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
    setState(() {
      filterExpandableStatus = true;
    });
  }

  // Method will be used for calling API
  void apiCallInitialization({String month = ''}) {
    // Getting context of the state management
    var weeklyContext = BlocProvider.of<DataCubit>(context);

    getWeeklyData(month.isNotEmpty ? month : HelperMethods.findMonth(), context)
        .then((response) {
      weeklyContext.loadWeekData(response);

      if (weeklyContext.state['week']!.isNotEmpty) {
        // This will get the month from the response and then use it
        // for drop-down list.
        // Drop-down will contain list of months starting from January
        // till the month on which response is received.
        if (month.isEmpty) {
          int monthRecordIndex =
              Values.months.indexOf(weeklyContext.state['week']![0]['month']);
          monthsList = Values.months.sublist(0, monthRecordIndex + 1);
        }

        for (var week in weeklyContext.state['week']!) {
          weeksList.add(week['week'].toString());
          employeeNamesList.add(week['employee']['name']);
        }

        List<String> uniqueWeeks = HelperMethods.dropdownItemsList(weeksList);
        employeeNamesList = HelperMethods.dropdownItemsList(employeeNamesList);
        setState(() {
          selectedMonth =
              month.isNotEmpty ? month : monthsList[monthsList.length - 1];
          selectedWeek = uniqueWeeks[uniqueWeeks.length - 1];
          selectedEmployee1 = employeeNamesList[0];
          selectedEmployee2 = employeeNamesList[1];
          isLoading = false;
        });
      } else {
        setState(() {
          showComparison = false;
          showChart = false;
          isLoading = false;
        });
      }
    }).catchError((err) {
      HelperMethods.showErrorToast(context, err);
    });
  }

  // Method gets two weeks for the comparison bar chart
  // and passed as (x,y) values to setupChartData(x, y1, y2)
  setupGroupIndex(dynamic employee1WeekData, dynamic employee2WeekData) {
    List<BarChartGroupData> response = [];

    if (employee1WeekData != null && employee2WeekData != null) {
      // Passing this list will help in displaying the value on top of each bar,
      // as Tooltip property needs a full list if we want to display on all bars.
      List<int> xAxisValues = List.generate(employee1WeekData.length, (index) {
        return index;
      });

      int xAxisValuesIndex = 0;
      List<String> bottomTitles = [];

      List<double> employee2YAxisList = [];
      employee2WeekData.forEach((propertyKey, propertyValue) {
        if (propertyKey != 'year' &&
            propertyKey != '__v' &&
            propertyKey != 'notable_comments' &&
            (propertyValue is int ||
                propertyValue is double ||
                propertyValue is List)) {
          employee2YAxisList.add(
              (propertyValue is List ? propertyValue.length : propertyValue)
                  .toDouble());
        }
      });

      employee1WeekData.forEach((propertyKey, propertyValue) {
        if (propertyKey != 'year' &&
            propertyKey != '__v' &&
            propertyKey != 'notable_comments' &&
            (propertyValue is int ||
                propertyValue is double ||
                propertyValue is List)) {
          bottomTitles.add(propertyKey);
          response.add(
            setupChartData(
                xAxisValues[xAxisValuesIndex],
                propertyValue is List ? propertyValue.length : propertyValue,
                xAxisValues,
                -1,
                employee2yAxisValue: employee2YAxisList[xAxisValuesIndex]),
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
    var employee1WeekData = {};
    var employee2WeekData = {};

    for (dynamic week in weeksData) {
      if (week['month'] == selectedMonth && week['week'] == selectedWeek) {
        if (week['employee']['name'] == selectedEmployee1) {
          employee1WeekData = week;
        }
        if (week['employee']['name'] == selectedEmployee2) {
          employee2WeekData = week;
        }
      }
    }

    final items = setupGroupIndex(employee1WeekData, employee2WeekData);
    rawBarGroups = items;
    barChartDataList = rawBarGroups;

    return Scaffold(
      backgroundColor: ColorValues.primary,
      body: !isLoading
          ? showComparison
              ? Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Padding(
                      padding: EdgeInsets.all(PaddingSize.charts),
                      child: Card(
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(
                              CustomSize.cardCircularRadius),
                        ),
                        color: ColorValues.secondary,
                        child: Padding(
                          padding:
                              EdgeInsets.all(PaddingSize.compareFiltersWidget),
                          child: Column(
                            children: [
                              Padding(
                                padding: EdgeInsets.symmetric(
                                    vertical: PaddingSize.vertical),
                                child: Text(
                                  Values.selectEmployeesForComparison,
                                  style: TextStyle(
                                      color: ColorValues.primaryTextColor,
                                      fontSize: FontSize.comparisonHeadingText),
                                ),
                              ),
                              Card(
                                color: ColorValues.primary.withOpacity(CustomSize
                                    .comparisonFiltersWidgetBackgroundOpacity),
                                child: Padding(
                                  padding: PaddingSize
                                      .comparisonChartExpandableWidget,
                                  child: ExpandablePanel(
                                    controller: ExpandableController(
                                        initialExpanded:
                                            filterExpandableStatus),
                                    theme: ExpandableThemeData(
                                        iconColor:
                                            ColorValues.primaryTextColor),
                                    header: Padding(
                                      padding: EdgeInsets.only(
                                        top: PaddingSize
                                            .comparisonChartExpandableTopPadding,
                                      ),
                                      child: Row(
                                        mainAxisAlignment:
                                            MainAxisAlignment.spaceBetween,
                                        crossAxisAlignment:
                                            CrossAxisAlignment.center,
                                        children: [
                                          Text(
                                            Values.filter,
                                            style: TextStyle(
                                              color:
                                                  ColorValues.primaryTextColor,
                                              fontSize: FontSize.text,
                                            ),
                                          ),
                                          Text(
                                            '${Values.monthsList[selectedMonth]} | $selectedWeek',
                                            style: TextStyle(
                                              color: ColorValues
                                                  .secondaryTextColor,
                                            ),
                                          )
                                        ],
                                      ),
                                    ),
                                    collapsed: Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceAround,
                                      children: [
                                        Row(
                                          children: [
                                            SizedBox(
                                              width: 15,
                                              height: 15,
                                              child: Container(
                                                decoration: BoxDecoration(
                                                  gradient: HelperMethods
                                                      .linearGradientColors(
                                                          ColorValues
                                                              .chartPrimaryColor,
                                                          ColorValues
                                                              .chartSecondaryColor,
                                                          0.2,
                                                          0.8),
                                                  shape: BoxShape.rectangle,
                                                  borderRadius:
                                                      const BorderRadius.all(
                                                          Radius.circular(3.0)),
                                                ),
                                              ),
                                            ),
                                            Padding(
                                              padding: const EdgeInsets.only(
                                                  left: 8.0),
                                              child: Text(
                                                selectedEmployee1,
                                                style: TextStyle(
                                                  color: ColorValues
                                                      .primaryTextColor,
                                                ),
                                              ),
                                            ),
                                          ],
                                        ),
                                        Icon(
                                          IconsList.comparisonIcon,
                                          color: ColorValues.secondaryTextColor,
                                        ),
                                        Row(
                                          children: [
                                            SizedBox(
                                              width: 15,
                                              height: 15,
                                              child: Container(
                                                decoration: BoxDecoration(
                                                  gradient: HelperMethods
                                                      .linearGradientColors(
                                                          ColorValues
                                                              .comparisonChartPrimaryColor,
                                                          ColorValues
                                                              .comparisonChartSecondaryColor,
                                                          0.9,
                                                          0.1),
                                                  shape: BoxShape.rectangle,
                                                  borderRadius:
                                                      const BorderRadius.all(
                                                          Radius.circular(3.0)),
                                                ),
                                              ),
                                            ),
                                            Padding(
                                              padding: const EdgeInsets.only(
                                                  left: 8.0),
                                              child: Text(
                                                selectedEmployee2,
                                                style: TextStyle(
                                                  color: ColorValues
                                                      .primaryTextColor,
                                                ),
                                              ),
                                            ),
                                          ],
                                        ),
                                      ],
                                    ),
                                    expanded: Column(
                                      children: [
                                        Row(
                                          children: [
                                            DropDownFilterWidget(
                                              Values.month,
                                              HelperMethods.dropdownItemsList(
                                                  monthsList),
                                              selectedMonth,
                                              (val) {
                                                if (val != selectedMonth &&
                                                    val !=
                                                        BlocProvider.of<DataCubit>(
                                                                    context)
                                                                .state['week']![
                                                            0]['month']) {
                                                  setState(
                                                      () => isLoading = true);
                                                  apiCallInitialization(
                                                      month: val);
                                                  setState(() =>
                                                      selectedMonth = val);
                                                }
                                              },
                                            ),
                                            DropDownFilterWidget(
                                              Values.week,
                                              HelperMethods.dropdownItemsList(
                                                  weeksList),
                                              selectedWeek,
                                              (val) => setState(
                                                  () => selectedWeek = val),
                                            ),
                                          ],
                                        ),
                                        DropDownFilterWidget(
                                          Values.employee1,
                                          HelperMethods.dropdownItemsList(
                                              employeeNamesList),
                                          selectedEmployee1,
                                          (val) => setState(
                                              () => selectedEmployee1 = val),
                                        ),
                                        DropDownFilterWidget(
                                          Values.employee2,
                                          HelperMethods.dropdownItemsList(
                                              employeeNamesList),
                                          selectedEmployee2,
                                          (val) => setState(
                                              () => selectedEmployee2 = val),
                                        ),
                                        Row(
                                          mainAxisAlignment:
                                              MainAxisAlignment.center,
                                          children: [
                                            IconButton(
                                              onPressed: () {
                                                setState(() {
                                                  filterExpandableStatus =
                                                      false;
                                                });
                                              },
                                              color:
                                                  ColorValues.primaryTextColor,
                                              icon: Icon(
                                                IconsList.applyFilterIcon,
                                              ),
                                            ),
                                            IconButton(
                                              onPressed: () => {
                                                // TODO: will add it's functionality later
                                              },
                                              color:
                                                  ColorValues.primaryTextColor,
                                              icon: Icon(
                                                IconsList.clearFilterIcon,
                                              ),
                                            ),
                                          ],
                                        )
                                      ],
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                    if (filterExpandableStatus == false)
                      Expanded(
                        child: Padding(
                          padding: EdgeInsets.symmetric(
                              horizontal: PaddingSize.charts),
                          child: Card(
                            color: ColorValues.secondary,
                            semanticContainer: true,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(
                                  CustomSize.cardCircularRadius),
                            ),
                            child: SizedBox(
                              height:
                                  screenSize.height * Charts.chartWidgetHeight,
                              child: Padding(
                                padding: CustomSize.comparisonChartPadding,
                                child: BarChartWidget(
                                  barChartDataList,
                                  bottomTitlesList,
                                  compareChart: true,
                                  callback: (val) =>
                                      setState(() => selectedItemIndex = val),
                                ),
                              ),
                            ),
                          ),
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
