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

// 3rd Party imports
import 'package:flutter_bloc/flutter_bloc.dart';

// Constant imports
import '../../constants/values.dart';
import '../../constants/assets.dart';
import '../../constants/color_values.dart';

// Component imports
import '../widgets/app_bar_widget.dart';
import './tabs/property_chart/property_chart.dart';
import './tabs/employee_chart/employee_chart.dart';
import './tabs/summary_chart/summary_chart.dart';
import './tabs/compare_chart/compare_chart.dart';
import '../../methods/helper_methods.dart';

// State Management imports
import '../../store/logged_in_user.dart';

class BottomTabNavigator extends StatefulWidget {
  const BottomTabNavigator({Key? key}) : super(key: key);

  @override
  State<BottomTabNavigator> createState() => _BottomTabNavigatorState();
}

class _BottomTabNavigatorState extends State<BottomTabNavigator> {
  int _selectedIndex = 0;

  // Method will change the value of state in case of tapping on
  // items of bottom bar.
  // Which will then be used to change the views in case of item selected
  void onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  final List<Widget> widgetOptions = <Widget>[
    const PropertyChart(),
    const EmployeeChart(),
    const SummaryChart(),
    const CompareChart(),
  ];

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<LoggedInUser, dynamic>(builder: (context, state) {
      return SafeArea(
        child: Scaffold(
          appBar: AppBarWidget(
            '${HelperMethods.findProject(context).name} details',
          ),
          body: widgetOptions.elementAt(_selectedIndex),
          bottomNavigationBar: BottomNavigationBar(
            type: BottomNavigationBarType.fixed,
            backgroundColor: ColorValues.primary,
            selectedItemColor: ColorValues.loginPageContrastColor,
            unselectedItemColor: ColorValues.secondaryTextColor,
            currentIndex: _selectedIndex,
            selectedLabelStyle: const TextStyle(
              fontWeight: FontWeight.bold,
            ),
            onTap: onItemTapped,
            items: <BottomNavigationBarItem>[
              BottomNavigationBarItem(
                icon: Icon(
                  IconsList.propertiesIcon,
                ),
                label: Values.properties,
              ),
              BottomNavigationBarItem(
                icon: Icon(
                  IconsList.employeesIcon,
                ),
                label: Values.employees,
              ),
              BottomNavigationBarItem(
                icon: Icon(
                  IconsList.summaryIcon,
                ),
                label: Values.summary,
              ),
              BottomNavigationBarItem(
                icon: Icon(
                  IconsList.comparisonIcon,
                ),
                label: Values.compare,
              ),
            ],
          ),
        ),
      );
    });
  }
}
