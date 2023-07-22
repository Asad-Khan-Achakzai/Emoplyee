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
import '../../../../constants/assets.dart';
import '../../../../constants/sizes.dart';
import '../../../../constants/color_values.dart';
import '../../../../constants/values.dart';

// Components imports
import '../methods/charts_helper_methods.dart';
import '../widgets/drop_down_widget.dart';
import '../widgets/setup_chart_data.dart';
import '../widgets/bar_chart_widget.dart';
import '../../../../methods/helper_methods.dart';
import '../widgets/default_chart_detail_widget.dart';
import '../widgets/chart_details_widget.dart';
import '../../../../api/get_weekly_data.dart';
import '../widgets/no_data_found_for_year.dart';
import '../widgets/pie_chart_widget.dart';

// State Management imports
import '../../../../store/data_cubit.dart';

// Model imports
import '../../../../models/week.dart';

class EmployeeChart extends StatefulWidget {
  const EmployeeChart({Key? key}) : super(key: key);

  @override
  State<EmployeeChart> createState() => EmployeeChartState();

  // This is used for getting the context in case of change of item in Drop Down
  static EmployeeChartState? of(BuildContext context) =>
      context.findAncestorStateOfType<EmployeeChartState>();
}

class EmployeeChartState extends State<EmployeeChart> {
  late List<BarChartGroupData> rawBarGroups;
  late List<BarChartGroupData> barChartDataList;
  late List<PieChartSectionData> pieChartDataList;
  static List<String> monthsList = [];
  static List<String> weeksList = [Values.allweeks];
  static List<Map<String, String>> propertiesList = [];
  static List<String> employeeNamesList = [];
  List<String> bottomTitlesList = [];
  bool isLoading = true;
  bool showChart = true;
  bool singleWeekSelected = false;

  String selectedMonth = '';
  set month(String value) => setState(() => selectedMonth = value);

  String selectedWeek = '';
  set week(String value) => setState(() => selectedWeek = value);

  Map<String, String> selectedProperty = {};
  set property(Map<String, String> value) =>
      setState(() => selectedProperty = value);

  int selectedItemIndex = -1;
  set selectedItem(int value) => setState(() => selectedItemIndex = value);

  String selectedChart = Values.barChart;

  @override
  void initState() {
    super.initState();
    apiCallInitialization();
  }

  void apiCallInitialization(
      {String month = '', String week = '', String employee = ''}) {
    var weeklyContext = BlocProvider.of<DataCubit>(context);

    getWeeklyData(month.isNotEmpty ? month : HelperMethods.findMonth(), context)
        .then((response) {
      weeklyContext.loadWeekData(response);
      if (weeklyContext.state['week']!.isNotEmpty) {
        List<dynamic> weeksData = weeklyContext.state['week']!;
        weeksData[0].forEach((propertyKey, propertyValue) {
          if (propertyKey != '__v' &&
              propertyKey != 'year' &&
              (propertyValue is int ||
                  propertyValue is double ||
                  propertyValue is List)) {
            propertiesList.add(
              {propertyKey: refactorToReadableForm(propertyKey)},
            );
          }
        });

        propertiesList = HelperMethods.uniqueList(propertiesList);

        for (var week in weeksData) {
          weeksList.add(week['week'].toString());
          employeeNamesList.add(week[Values.employee][Values.name]);
        }

        List<String> uniqueWeeks = HelperMethods.dropdownItemsList(weeksList);

        if (month.isEmpty) {
          int monthRecordIndex =
              Values.months.indexOf(weeklyContext.state['week']![0]['month']);
          monthsList = Values.months.sublist(0, monthRecordIndex + 1);
        }

        // In case of notable comments added. API will be called again
        // and 3 optional params will be passed in case of comment added
        // They will ensure the UI will maintain it's state
        // For default case Last Month & All Weeks filter will be displayed in UI

        setState(() {
          selectedMonth =
              month.isNotEmpty ? month : monthsList[monthsList.length - 1];
          selectedWeek = week.isNotEmpty ? week : uniqueWeeks[0];
          // in case of week is not empty. API Call is called from the property
          // of Notable comments. So for maintaining it's state we will set it
          selectedProperty = week.isNotEmpty
              ? {'notable_comments': 'Notable Comments'}
              : propertiesList[0];
          isLoading = false;
        });
      } else {
        setState(() {
          showChart = false;
          isLoading = false;
        });
      }
    }).catchError((err) {
      HelperMethods.showErrorToast(context, err.toString());
    });
  }

  String refactorToReadableForm(String label) {
    List<String> labelsList = label.split('_');
    String response = '';
    for (String element in labelsList) {
      response += ' ${element[0].toUpperCase()}${element.substring(1)}';
    }
    return response.trim();
  }

  // Method Gets the list of weeks and other monthly computations
  // and passed as (x,y) values to setupChartData(x,y)
  List<BarChartGroupData> setupGroupIndex(List weeksData) {
    List<BarChartGroupData> response = [];
    // Passing this list will help in displaying the value on top of each bar,
    // as Tooltip property needs a full list if we want to display on all bars.
    List<int> xAxisValues = List.generate(weeksData.length, (index) {
      return index;
    });

    int xAxisValuesIndex = 0;
    List<String> bottomTitles = [];

    for (var week in weeksData) {
      bottomTitles.add(week[Values.name]);
      response.add(
        setupChartData(
          xAxisValues[xAxisValuesIndex],
          week[Values.data] is List
              ? week[Values.data].length
              : week[Values.data],
          xAxisValues,
          selectedItemIndex,
        ),
      );
      xAxisValuesIndex++;
    }

    setState(() {
      bottomTitlesList = bottomTitles;
    });
    return response;
  }

  List<PieChartSectionData> setupPieChartData(List weeksData) {
    List<PieChartSectionData> response = [];

    int valuesIndex = 0;

    Color pieChartColor = ColorValues.chartPrimaryColor;
    for (var week in weeksData) {
      final isTouched = valuesIndex == selectedItemIndex;
      final radius = isTouched ? 36.0 : 28.0;
      final fontSize = isTouched ? 18.0 : 14.0;
      final fontWeight = isTouched ? FontWeight.bold : FontWeight.normal;

      response.add(
        PieChartSectionData(
          color: pieChartColor,
          value: week[Values.data] is List
              ? week[Values.data].length.toDouble()
              : week[Values.data].toDouble(),
          title: week[Values.name].split(' ')[0],
          radius: radius,
          titleStyle: TextStyle(
            color: ColorValues.primary,
            fontSize: fontSize,
            fontWeight: fontWeight,
          ),
        ),
      );
      pieChartColor = pieChartColor == ColorValues.chartPrimaryColor
          ? ColorValues.chartSecondaryColor
          : ColorValues.chartPrimaryColor;
      valuesIndex++;
    }
    return response;
  }

  findDetails(weeksData) {
    Map<String, dynamic> detailsData = {};
    if (!singleWeekSelected) {
      detailsData = ChartsHelperMethods.getDefaultWeekObject();
    }

    for (var week in weeksData) {
      if (week['month'] == selectedMonth &&
          week[Values.employee][Values.name] ==
              bottomTitlesList[selectedItemIndex]) {
        if (singleWeekSelected) {
          if (week['week'] == selectedWeek) {
            detailsData = week;
          }
        } else {
          detailsData = ChartsHelperMethods.computeAllWeeksData(
              previousWeeksData: detailsData, currentWeekData: week);
        }
      }
    }
    return detailsData;
  }

  changeSelectedChart(String chart) {
    if (selectedChart != chart) {
      setState(() {
        selectedChart = chart;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    var weeksData = BlocProvider.of<DataCubit>(context).state['week']!;
    List selectedWeekData = [];
    if (Values.weeksList.contains(selectedWeek)) {
      singleWeekSelected = true;
    } else {
      singleWeekSelected = false;
    }

    for (var weekJson in weeksData) {
      Week week = Week.fromJson(weekJson);
      if (singleWeekSelected) {
        if (week.week == selectedWeek) {
          selectedWeekData.add({
            Values.name: week.employee.name,
            Values.data: ChartsHelperMethods.findPropertyData(
              week: week,
              propertyName:
                  HelperMethods.findPropertyKeyFromItem(selectedProperty),
            ),
          });
        }
      } else {
        bool isEmployeeUpdated = false;
        dynamic updatedData = ChartsHelperMethods.calculateAllWeeksData(
          selectedPropertyMap: selectedProperty,
          employeeName: week.employee.name,
          weeksData: weeksData,
        );

        for (var element in selectedWeekData) {
          if (element[Values.name] == week.employee.name) {
            element[Values.data] = updatedData;
            isEmployeeUpdated = true;
          }
        }

        if (!isEmployeeUpdated) {
          selectedWeekData.add({
            Values.name: week.employee.name,
            Values.data: updatedData,
          });
        }
      }
    }

    final items = setupGroupIndex(selectedWeekData);
    rawBarGroups = items;
    barChartDataList = rawBarGroups;
    pieChartDataList = setupPieChartData(selectedWeekData);

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
                                Row(
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
                                          setState(() => selectedMonth = val);
                                        }
                                      },
                                    ),
                                    DropDownWidget(
                                      itemsList:
                                          HelperMethods.dropdownItemsList(
                                              weeksList),
                                      selectedValue: selectedWeek,
                                      callback: (val) =>
                                          setState(() => selectedWeek = val),
                                    ),
                                    DropDownWidget(
                                      itemsList:
                                          HelperMethods.findPropertiesList(
                                              propertiesList),
                                      selectedValue:
                                          HelperMethods.findPropertyValue(
                                              selectedProperty),
                                      callback: (val) {
                                        var newState =
                                            HelperMethods.findPropertyKey(
                                                val, propertiesList);
                                        setState(
                                            () => selectedProperty = newState);
                                      },
                                    ),
                                  ],
                                ),
                                Container(
                                  transform: Matrix4.translationValues(
                                      0.0, -20.0, 0.0),
                                  child: Padding(
                                    padding: EdgeInsets.only(
                                        top: PaddingSize.chartSelectionIcon),
                                    child: Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      children: [
                                        IconButton(
                                          onPressed: () => {
                                            changeSelectedChart(Values.barChart)
                                          },
                                          color: ColorValues.primary,
                                          icon: Icon(
                                            IconsList.barChartIcon,
                                            size:
                                                selectedChart == Values.barChart
                                                    ? IconSize.large
                                                    : IconSize.small,
                                            color: selectedChart ==
                                                    Values.barChart
                                                ? ColorValues.primaryTextColor
                                                : ColorValues
                                                    .secondaryTextColor,
                                          ),
                                        ),
                                        IconButton(
                                          onPressed: () => {
                                            changeSelectedChart(Values.pieChart)
                                          },
                                          color: ColorValues.primary,
                                          icon: Icon(
                                            IconsList.pieChartIcon,
                                            size:
                                                selectedChart == Values.pieChart
                                                    ? IconSize.large
                                                    : IconSize.small,
                                            color: selectedChart ==
                                                    Values.pieChart
                                                ? ColorValues.primaryTextColor
                                                : ColorValues
                                                    .secondaryTextColor,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                                Expanded(
                                  child: Padding(
                                    padding: EdgeInsets.all(PaddingSize.charts),
                                    child: selectedChart == Values.barChart
                                        ? BarChartWidget(
                                            barChartDataList,
                                            bottomTitlesList,
                                            employeeChart: true,
                                            callback: (val) => setState(
                                                () => selectedItemIndex = val),
                                          )
                                        : PieChartWidget(pieChartDataList,
                                            callback: (val) => setState(
                                                () => selectedItemIndex = val)),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ),
                    Expanded(
                      flex: 4,
                      child: selectedItemIndex == -1
                          ? const DefaultChartDetailWidget()
                          : DetailsWidget(
                              HelperMethods.findPropertyKeyFromItem(
                                  selectedProperty),
                              findDetails(weeksData),
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
