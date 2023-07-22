/**
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

// React imports
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

// Material imports
import { useTheme } from '@mui/material/styles';
import { Grid, MenuItem, TextField } from '@mui/material';

// third-party imports
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';
import Select from 'react-select';
import PropTypes from 'prop-types';

// Component imports
import BarChart from '../../../ui-component/cards/Skeleton/barChart';
import MainCard from '../../../ui-component/cards/mainCard';
import { gridSpacing } from '../../../constants/constants';
import { ChartSwitch } from '../../../components/chartSwitch';
import {
  themeConstants,
  ChartMainCard,
  ChartGrid,
  NoDataFoundTyopgraphy,
  NoDataFoundGrid,
  StyledChartGrid,
} from '../../../constants/theme-constants';

// Constant imports
import { constants } from '../../../constants/constants';
import { colorConstants } from '../../../constants/color-constants';

// Function imports
import { getPercentWidth } from './commonFunctions';

/**
 * Function to display summary of employees for the particular property in the form of bar chart
 * @param {{
 *    isLoading: Boolean, // Boolean to check loading state
 *    monthData: Array, // List of whole month's weeks data for each employee
 *    setWeekId: Function, // Function to set weekId
 *    setWeekMonth: Function, // Function to set week of the month
 *    selectedProperty: String, // Selected property eg: carry over stories, Complexity
 *    selectedWeekMonth: String, // Selected week of the month
 * }}
 */
const WeekPropertiesChart = ({
  isLoading,
  monthData,
  selectedProperty,
  setWeekId,
  setWeekMonth,
  selectedWeekMonth,
  chartType,
  setChartType,
  employees,
  weeks,
  monthSubList,
}) => {
  const theme = useTheme();
  const [month, setMonth] = useState();
  const [week, setWeek] = useState(weeks && weeks.length > 0 ? weeks[0] : null);
  const [employeesWithSelectedPropertys, setEmployeesWithSelectedPropertys] =
    useState([]);
  const [selectedPropertyForDetailCard, setSelectedProperty] = useState(
    constants.dropDowns.properties[0].value
  );
  useEffect(() => {
    computeData(monthData, null, employees);
  }, []);
  useEffect(() => {
    if (!monthData.length) {
      setSelectedProperty(null);
    }
    computeData(monthData, week ? week : null, employees);
  }, [selectedPropertyForDetailCard, monthData]);

  const customization = useSelector((state) => state.customization);

  let barChartData = {
    height: '100%',
    width: '100%',
    type: 'bar',
    options: {
      chart: {
        id: 'bar-chart',
        stacked: true,
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: true,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0,
            },
          },
        },
      ],
      testKey: 'testKey', // For chart data updation
      chart: {
        background: colorConstants.chartPrimaryColor,
        foreColor: colorConstants.labelsColor,
        events: {
          // Detail card is diplayed for a paticular bar when clicked
          // Showing detail card for the bars those have textual data eg: carry over stories
          dataPointSelection: (event, chartContext, config) => {
            // Getting the label of the current selected property
            let selectedPropertyObjectValue =
              constants.dropDowns.properties.find(
                (property) => property.value === selectedPropertyForDetailCard
              );
            if (employeesWithSelectedPropertys[config.dataPointIndex].weekId) {
              setWeekId(
                employeesWithSelectedPropertys[config.dataPointIndex].weekId
              );
            }
            if (
              employeesWithSelectedPropertys[config.dataPointIndex]
                .listPropertyData.length
            ) {
              selectedProperty(
                selectedPropertyObjectValue.label,
                employeesWithSelectedPropertys[config.dataPointIndex]
                  .listPropertyData
              );
            } else {
              selectedProperty(selectedPropertyObjectValue.label, null);
            }
          },
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: getPercentWidth(
            constants.barChartWidth,
            employeesWithSelectedPropertys?.length,
            constants.barChartBarWidth
          ),
          borderRadius: 30,
        },
      },
      xaxis: {
        type: 'category',
        categories: employeesWithSelectedPropertys.map(
          (obj) => obj.employeeName
        ),
      },
      legend: {
        show: true,
        fontSize: '14px',
        fontFamily: `'Roboto', sans-serif`,
        position: 'bottom',
        offsetX: 20,
        labels: {
          useSeriesColors: false,
        },
        markers: {
          width: 16,
          height: 16,
          radius: 5,
        },
        itemMargin: {
          horizontal: 15,
          vertical: 8,
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          type: 'vertical',
          shade: 'light',
          shadeIntensity: 0,
          opacityFrom: 0.8,
          opacityTo: 0.9,
          colorStops: [
            {
              offset: 20,
              color: colorConstants.barChartPrimaryColor,
              opacity: 1,
            },
            {
              offset: 90,
              color: colorConstants.barChartSecondaryColor,
              opacity: 1,
            },
          ],
        },
      },
      dataLabels: {
        enabled: false,
      },
      grid: {
        show: true,
      },
    },
    // Summary: It is displayed when mouse is hovered on the bar eg: Summary:35
    // data: It is basically the length of the bars so the number of employees the number of bars are displayed.
    series: [
      {
        name: '',
        data: employeesWithSelectedPropertys.map(
          (obj) => obj.listPropertyDataLength
        ),
      },
    ],
  };
  let pieChartData = {
    type: 'pie',
    height: '100%',
    width: '100%',
    options: {
      labels: employeesWithSelectedPropertys.map((obj) => obj.employeeName),
      theme: {
        monochrome: {
          enabled: false,
        },
      },
      testKey: 'testKey', // For chart data updation
      chart: {
        foreColor: 'white',
        events: {
          // Detail card is diplayed for a paticular bar when clicked
          // Showing detail card for the indexes those have textual data eg: arry over stories
          dataPointSelection: (event, chartContext, config) => {
            const timer = setTimeout(() => {
              // Getting the label of the current selected property
              let selectedPropertyObjectValue =
                constants.dropDowns.properties.find(
                  (property) => property.value === selectedPropertyForDetailCard
                );
              if (
                employeesWithSelectedPropertys[config.dataPointIndex].weekId
              ) {
                setWeekId(
                  employeesWithSelectedPropertys[config.dataPointIndex].weekId
                );
              }
              if (
                employeesWithSelectedPropertys[config.dataPointIndex]
                  .listPropertyData.length
              ) {
                selectedProperty(
                  selectedPropertyObjectValue.label,
                  employeesWithSelectedPropertys[config.dataPointIndex]
                    .listPropertyData
                );
              } else {
                selectedProperty(selectedPropertyObjectValue.label, null);
              }
            }, 300);
          },
        },
      },
    },
    series: employeesWithSelectedPropertys.map(
      (obj) => obj.listPropertyDataLength
    ),
  };
  /**
   * Handles property change
   * @param {String} property
   */
  const handlePropertyChange = (property) => {
    setSelectedProperty(property);
    setChartType(constants.chartTypes.barChart);
    // Initialize detail card
    selectedProperty(null, null);
  };

  /**
   * Function to validate selectedPropertyForDetailCard
   */
  const validateSelectedProperty = () => {
    if (
      selectedPropertyForDetailCard ===
        constants.dropDowns.properties[1].value || // complexity
      selectedPropertyForDetailCard === constants.dropDowns.properties[5].value // story_deficit
    ) {
      return true;
    }
    return false;
  };

  /**
   * Function to compute values for the properties of the chart
   * @param {Array} array
   * @param {String} week
   * @param {Array} employeeList
   */
  const computeData = (array, week, employeeList) => {
    let employeesWithSelectedProperty = [];
    for (const employee of employeeList) {
      let listPropertyData = [];
      let numberPropertyData = 0;
      let listPropertyDataLength = 0;
      let weekId;
      // Get all objects of the current employee
      let filteredMonthData = array.filter(
        (row) => row.employee._id === employee._id
      );

      for (const weekData of filteredMonthData) {
        // If week does not exist than add the sum of the property of all month
        if (
          week &&
          weekData.week === week &&
          week !== constants.labels.allWeeks
        ) {
          // Merge Arrays
          if (validateSelectedProperty()) {
            numberPropertyData += weekData[selectedPropertyForDetailCard];
          } else {
            listPropertyData.push(...weekData[selectedPropertyForDetailCard]);
          }
          weekId = weekData._id;
        } else if (week === constants.labels.allWeeks) {
          // Merge Arrays
          if (validateSelectedProperty()) {
            numberPropertyData += weekData[selectedPropertyForDetailCard];
          } else {
            listPropertyData.push(...weekData[selectedPropertyForDetailCard]);
          }
        }
      }
      // Populate data for chart
      if (validateSelectedProperty()) {
        listPropertyDataLength = numberPropertyData;
      } else {
        listPropertyDataLength = listPropertyData.length;
      }
      employeesWithSelectedProperty.push({
        employeeName: employee.name,
        property: selectedPropertyForDetailCard,
        listPropertyData: listPropertyData,
        listPropertyDataLength: listPropertyDataLength,
        weekId: weekId,
      });
    }
    setEmployeesWithSelectedPropertys(employeesWithSelectedProperty);

    // State is not updating in barChartData thats why passing dummy value to update the chart with latest data
    barChartData.options.testKey = constants.chartTestKeyValue;
    pieChartData.options.testKey = constants.chartTestKeyValue;
  };

  /**
   * Handles week change
   * @param {String} week
   */
  const handleWeekChange = (week) => {
    if (week === constants.labels.allWeeks) {
      setWeekId(null);
    }
    setWeek(week);
    computeData(monthData, week, employees);
    setChartType(constants.chartTypes.barChart);
    // Initialize detail card
    selectedProperty(null, null);
  };

  /**
   * Handles month change
   * @param {String} month
   */
  const handleMonthChange = (month) => {
    setMonth(month);
    setWeekMonth(month);
    setChartType(constants.chartTypes.barChart);
    // Initialize detail card
    selectedProperty(null, null);
  };

  /**
   * Function to handle chart Type Change
   * @param {String} value
   */
  const handleChartTypeChange = (value) => {
    setChartType(value);
    selectedProperty(null, null);
  };

  return (
    <>
      {isLoading ? (
        <BarChart />
      ) : (
        <ChartMainCard>
          <ChartGrid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <Grid container justifyContent='end'>
                <ChartSwitch
                  radioButton={chartType}
                  setRadioButton={handleChartTypeChange}
                />
                <Select
                  menuPlacement='auto'
                  menuPosition='fixed'
                  styles={themeConstants.customStyles}
                  placeholder='Month'
                  value={constants.months.find(
                    (month) => month.value === selectedWeekMonth
                  )}
                  options={monthSubList.filter((month) => {
                    if (month.value !== selectedWeekMonth) {
                      return month;
                    }
                  })}
                  onChange={(e) => {
                    handleMonthChange(e.value);
                  }}
                />
                <Select
                  menuPlacement='auto'
                  menuPosition='fixed'
                  styles={themeConstants.customStyles}
                  placeholder='Week'
                  value={
                    weeks && weeks.length > 0
                      ? { value: week, label: week }
                      : null
                  }
                  options={weeks.map((week) => {
                    return {
                      value: week,
                      label: week,
                    };
                  })}
                  onChange={(e) => {
                    handleWeekChange(e.value);
                  }}
                />
                <Select
                  menuPlacement='auto'
                  menuPosition='fixed'
                  styles={themeConstants.customStyles}
                  placeholder='Property'
                  defaultValue={
                    monthData.length > 0
                      ? constants.dropDowns.properties[0]
                      : null
                  }
                  options={constants.dropDowns.properties}
                  onChange={(e) => {
                    handlePropertyChange(e.value);
                  }}
                />
              </Grid>
            </Grid>
            <StyledChartGrid item xs={12}>
              {employeesWithSelectedPropertys.length ? (
                <>
                  {chartType === constants.chartTypes.barChart ? (
                    <Chart {...barChartData} />
                  ) : null}
                  {chartType === constants.chartTypes.pieChart ? (
                    <Chart {...pieChartData} />
                  ) : null}
                </>
              ) : (
                <NoDataFoundGrid item xs={12}>
                  <NoDataFoundTyopgraphy>
                    {constants.noDataMessage.noData}
                  </NoDataFoundTyopgraphy>
                </NoDataFoundGrid>
              )}
            </StyledChartGrid>
          </ChartGrid>
        </ChartMainCard>
      )}
    </>
  );
};
WeekPropertiesChart.propTypes = {
  isLoading: PropTypes.bool,
};

export default WeekPropertiesChart;
