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
import '../widgets/bar_chart_widget.dart';
import '../widgets/default_chart_detail_widget.dart';
import '../widgets/chart_details_widget.dart';
import '../../../../api/get_monthly_data.dart';
import '../../../../methods/helper_methods.dart';
import '../widgets/no_data_found_for_year.dart';

// State Management imports
import '../../../../store/data_cubit.dart';

class SummaryChart extends StatefulWidget {
  const SummaryChart({Key? key}) : super(key: key);

  @override
  State<SummaryChart> createState() => SummaryChartState();

  // This is used for getting the context in case of change of item in Drop Down
  static SummaryChartState? of(BuildContext context) =>
      context.findAncestorStateOfType<SummaryChartState>();
}

class SummaryChartState extends State<SummaryChart> {
  late List<BarChartGroupData> rawBarGroups;
  late List<BarChartGroupData> barChartDataList;
  static List<String> monthsList = [];
  static List<String> employeeNamesList = [];
  List<String> bottomTitlesList = [];
  bool isLoading = true;
  bool showChart = true;

  String selectedEmployee = '';
  set employee(String value) => setState(() => selectedEmployee = value);

  String selectedMonth = '';
  set month(String value) => setState(() => selectedMonth = value);

  int _selectedItemIndex = -1;
  set selectedItem(int value) => setState(() => _selectedItemIndex = value);

  @override
  void initState() {
    super.initState();
    apiCallInitialization();
  }

  void apiCallInitialization({String month = ''}) {
    var monthlyContext = BlocProvider.of<DataCubit>(context);
    getMonthlyData(
            month.isNotEmpty ? month : HelperMethods.findMonth(), context)
        .then((response) {
      monthlyContext.loadMonthData(response);

      if (monthlyContext.state['month']!.isNotEmpty) {
        for (var month in monthlyContext.state['month']!) {
          employeeNamesList.add(month['employee']['name']);
        }

        if (month.isEmpty) {
          int monthRecordIndex =
              Values.months.indexOf(monthlyContext.state['month']![0]['month']);
          monthsList = Values.months.sublist(0, monthRecordIndex + 1);
        }

        setState(() {
          selectedMonth =
              month.isNotEmpty ? month : monthsList[monthsList.length - 1];
          selectedEmployee = employeeNamesList[0];
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
  setupGroupIndex(dynamic month) {
    List<BarChartGroupData> response = [];

    if (month != null) {
      // Passing this list will help in displaying the value on top of each bar,
      // as Tooltip property needs a full list if we want to display on all bars.
      List<int> xAxisValues = List.generate(month.length, (index) {
        return index;
      });

      int xAxisValuesIndex = 0;
      List<String> bottomTitles = [];

      month.forEach((propertyKey, propertyValue) {
        if (propertyKey != 'year' &&
            propertyKey != '__v' &&
            (propertyValue is int || propertyValue is double)) {
          bottomTitles.add(propertyKey);
          response.add(
            setupChartData(
              xAxisValues[xAxisValuesIndex],
              propertyValue,
              xAxisValues,
              _selectedItemIndex,
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
    var monthData = BlocProvider.of<DataCubit>(context).state['month']!;
    dynamic selectedMonthData;

    for (var month in monthData) {
      if (month['employee']['name'] == selectedEmployee &&
          month['month'] == selectedMonth) {
        selectedMonthData = month;
      }
    }

    final items = setupGroupIndex(selectedMonthData);
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
                                                          .state['month']![0]
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
                                    padding: EdgeInsets.all(PaddingSize.charts),
                                    child: BarChartWidget(
                                      barChartDataList,
                                      bottomTitlesList,
                                      callback: (val) => setState(
                                          () => _selectedItemIndex = val),
                                    ),
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
                      child: _selectedItemIndex == -1
                          ? const DefaultChartDetailWidget()
                          : DetailsWidget(
                              bottomTitlesList[_selectedItemIndex],
                              selectedMonthData,
                              apiCallInitialization,
                              selectedIndexValue: (val) =>
                                  setState(() => _selectedItemIndex = val),
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
