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
import { useState, useEffect, useRef, useImperativeHandle } from 'react';

// Material imports
import { useTheme } from '@mui/material/styles';
import { Grid } from '@mui/material';

// Third party imports
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';
import Select from 'react-select';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

// Component imports
import BarChart from '../../../ui-component/cards/Skeleton/barChart';
import MainCard from '../../../ui-component/cards/mainCard';
import { gridSpacing } from '../../../constants/constants';

// Constant imports
import { constants } from '../../../constants/constants';
import {
  themeConstants,
  ChartMainCard,
  ChartGrid,
  NoDataFoundTyopgraphy,
  NoDataFoundGrid,
  StyledChartGrid,
} from '../../../constants/theme-constants';
import { colorConstants } from '../../../constants/color-constants';

// Function imports
import { getPercentWidth } from './commonFunctions';

// ==============================|| DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART ||============================== //
// Initial value of chart
let chartValueObjects = {};

/**
 * Function to display Weekly summary of the employees for a particular property
 * @param {{
 *    isLoading: Boolean, // Boolean to check loading state
 *    monthData: Array, // List of whole month's weeks data for each employee
 *    setWeekId: Function, // Function to set weekId
 *    setWeekMonth: Function, // Function to set week of the month
 *    selectedProperty: String, // Selected property eg: carry over stories, Complexity
 *    selectedWeekMonth: String, // Selected week of the month
 * }}
 */
const WeekEmployeeChart = ({
  isLoading,
  selectedProperty,
  monthData,
  setWeekId,
  setWeekMonth,
  selectedWeekMonth,
  employees,
  weeks,
  monthSubList,
}) => {
  const weeklyEmployeeObject = {
    carryover_stories: 0,
    complexity: 0,
    prs_merged: 0,
    new_stories_assigned: 0,
    stories_completed: 0,
    story_deficit: 0,
    notable_comments: 0,
  };
  useEffect(() => {
    computeData(monthData, week ? week : null, employee);

    // State is not updating in chartData thats why passing dummy value to update the chart with latest data
    chartData.options.testKey = constants.chartTestKeyValue;
  }, [monthData]);
  const [employee, setEmployee] = useState(
    employees && employees.length > 0 ? employees[0]?._id : null
  );
  const theme = useTheme();
  const [month, setMonth] = useState();
  const [week, setWeek] = useState(
    weeks && weeks.length > 0 ? weeks[0] : 'week1'
  );
  const customization = useSelector((state) => state.customization);
  const [chartValueData, setChartValueData] = useState(weeklyEmployeeObject);

  /**
   * Function to compute values for the properties of the chart
   * @param {Array} array
   * @param {String} week
   * @param {String} employeeId
   */
  const computeData = (array, week, employeeId) => {
    resetChartValues();
    let chartValueDataCopy = {
      carryover_stories: 0,
      complexity: 0,
      prs_merged: 0,
      new_stories_assigned: 0,
      stories_completed: 0,
      story_deficit: 0,
      notable_comments: 0,
    };
    for (const item of array) {
      // If week does not exist than add the sum of each property of all months
      if (week && !employeeId && week !== constants.labels.allWeeks) {
        if (item.week === week) {
          // Merge Arrays
          chartValueObjects.carryover_stories.push(...item.carryover_stories);
          chartValueObjects.prs_merged.push(...item.prs_merged);
          chartValueObjects.notable_comments.push(...item.notable_comments);
          chartValueObjects.new_stories_assigned.push(
            ...item.new_stories_assigned
          );
          chartValueObjects.stories_completed.push(...item.stories_completed);
          chartValueObjects.complexity += item.complexity;
          chartValueObjects.story_deficit += item.story_deficit;
        }
      } else if (employeeId && week === constants.labels.allWeeks) {
        if (item.employee?._id === employeeId) {
          chartValueObjects.carryover_stories.push(...item.carryover_stories);
          chartValueObjects.prs_merged.push(...item.prs_merged);
          chartValueObjects.new_stories_assigned.push(
            ...item.new_stories_assigned
          );
          chartValueObjects.stories_completed.push(...item.stories_completed);
          chartValueObjects.notable_comments.push(...item.notable_comments);
          chartValueObjects.complexity = item.complexity;
          chartValueObjects.story_deficit = item.story_deficit;
        }
      } else if (week && employeeId && week !== constants.labels.allWeeks) {
        if (item.week === week && item.employee?._id === employeeId) {
          chartValueObjects.carryover_stories = item.carryover_stories;
          chartValueObjects.prs_merged = item.prs_merged;
          chartValueObjects.new_stories_assigned = item.new_stories_assigned;
          chartValueObjects.stories_completed = item.stories_completed;
          chartValueObjects.notable_comments = item.notable_comments;
          chartValueObjects.complexity = item.complexity;
          chartValueObjects.story_deficit = item.story_deficit;
          setWeekId(item._id);
        }
      } else {
        chartValueObjects.carryover_stories.push(...item.carryover_stories);
        chartValueObjects.prs_merged.push(...item.prs_merged);
        chartValueObjects.new_stories_assigned.push(
          ...item.new_stories_assigned
        );
        chartValueObjects.stories_completed.push(...item.stories_completed);
        chartValueObjects.notable_comments.push(...item.notable_comments);
        chartValueObjects.complexity += item.complexity;
        chartValueObjects.story_deficit += item.story_deficit;
      }
    }
    chartValueDataCopy.carryover_stories =
      chartValueObjects.carryover_stories.length;
    chartValueDataCopy.prs_merged = chartValueObjects.prs_merged.length;
    chartValueDataCopy.new_stories_assigned =
      chartValueObjects.new_stories_assigned.length;
    chartValueDataCopy.stories_completed =
      chartValueObjects.stories_completed.length;
    chartValueDataCopy.notable_comments =
      chartValueObjects.notable_comments.length;
    chartValueDataCopy.complexity = chartValueObjects.complexity;
    chartValueDataCopy.story_deficit = chartValueObjects.story_deficit;
    setChartValueData(chartValueDataCopy);

    // State is not updating in chartData thats why passing dummy value to update the chart with latest data
    chartData.options.testKey = constants.chartTestKeyValue;
  };

  /**
   * Function to initialize chartValueData
   */
  const resetChartValues = () => {
    setChartValueData({
      carryover_stories: 0,
      complexity: 0,
      prs_merged: 0,
      new_stories_assigned: 0,
      stories_completed: 0,
      story_deficit: 0,
      notable_comments: 0,
    });
    chartValueObjects = {
      carryover_stories: [],
      complexity: 0,
      prs_merged: [],
      new_stories_assigned: [],
      stories_completed: [],
      story_deficit: 0,
      notable_comments: [],
    };
  };
  const chartData = {
    height: '100%',
    type: 'bar',
    width: '100%',
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
          dataPointSelection: function (event, chartContext, config) {
            let propertyLabel;
            // If index is of carry over stories than get carry over stories
            let selectedIndexData;
            switch (config.dataPointIndex) {
              case 0:
                selectedIndexData = chartValueObjects.carryover_stories;
                break;
              case 2:
                selectedIndexData = chartValueObjects.prs_merged;
                break;
              case 3:
                selectedIndexData = chartValueObjects.new_stories_assigned;
                break;
              case 4:
                selectedIndexData = chartValueObjects.stories_completed;
                break;
              case 6:
                selectedIndexData = chartValueObjects.notable_comments;
                break;
              default:
                selectedIndexData = null;
            }
            propertyLabel =
              constants.dropDowns.properties[config.dataPointIndex]?.label;
            selectedProperty(propertyLabel, selectedIndexData);
          },
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: getPercentWidth(
            constants.barChartWidth,
            constants.chartsCategories.employeeChartCategories.length + 1,
            constants.barChartBarWidth
          ),
          borderRadius: 30,
        },
      },
      xaxis: {
        type: 'category',
        categories: constants.chartsCategories.employeeChartCategories.concat([
          constants.labels.notableComments,
        ]),
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
    series: [
      {
        name: '',
        data: [
          chartValueData?.carryover_stories,
          chartValueData?.complexity,
          chartValueData?.prs_merged,
          chartValueData?.new_stories_assigned,
          chartValueData?.stories_completed,
          chartValueData?.story_deficit,
          chartValueData?.notable_comments,
        ],
      },
    ],
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
    computeData(monthData, week, employee);
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
    // Initialize detail card
    selectedProperty(null, null);
  };

  /**
   * Function to handle employee change
   * @param {String} employee
   */
  const handleEmployeeChange = (employee) => {
    setEmployee(employee);
    computeData(monthData, week, employee);

    // Initialize detail card
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
                <Select
                  menuPlacement='auto'
                  menuPosition='fixed'
                  placeholder='Month'
                  styles={themeConstants.customStyles}
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
                  placeholder='Employee'
                  disabled={!employee}
                  value={
                    employee
                      ? {
                          ...employees
                            .filter((employe) => employe._id === employee)
                            .map((employe) => {
                              return {
                                value: employee,
                                label: employe.name,
                              };
                            })[0],
                        }
                      : null
                  }
                  options={employees.map((employee) => {
                    return {
                      value: employee._id,
                      label: employee.name,
                    };
                  })}
                  onChange={(e) => {
                    handleEmployeeChange(e.value);
                  }}
                />
              </Grid>
            </Grid>
            <StyledChartGrid item xs={12}>
              {chartValueData?.carryover_stories.length > 0 ||
              chartValueData?.complexity ||
              chartValueData?.carryover_stories.length > 0 ||
              chartValueData?.new_stories_assigned.length > 0 ||
              chartValueData?.stories_completed.length > 0 ||
              chartValueData?.prs_merged.length > 0 ||
              chartValueData?.story_deficit ? (
                <Chart {...chartData} />
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
WeekEmployeeChart.propTypes = {
  isLoading: PropTypes.bool,
};

export default WeekEmployeeChart;
