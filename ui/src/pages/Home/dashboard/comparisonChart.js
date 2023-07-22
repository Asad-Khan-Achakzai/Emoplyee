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
import { useState, useEffect, useMemo, useImperativeHandle } from 'react';

// Material imports
import { useTheme } from '@mui/material/styles';
import { Grid } from '@mui/material';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
} from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

// Third party imports
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';
import Select from 'react-select';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

// Component imports
import BarChart from '../../../ui-component/cards/Skeleton/barChart';

// Constant imports
import { gridSpacing } from '../../../constants/constants';
import { constants } from '../../../constants/constants';
import {
  themeConstants,
  ChartMainCard,
  InvitationButton,
  StyledAccordion,
  AccordionGrid,
  StyledExpandMoreIcon,
  StyledAccordionDetails,
  StyledFilterDiv,
  EmployeesFilterDiv,
  ComparisonIconDiv,
  NoDataFoundTyopgraphy,
  NoDataFoundGrid,
  EmployeeTypography,
  MonthAndWeekTypographyGrid,
  NoDataGridForComparisonChart,
  StyledChartGrid,
} from '../../../constants/theme-constants';
import { colorConstants } from '../../../constants/color-constants';

// Function imports
import { getPercentWidth } from './commonFunctions';

// ==============================|| DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART ||============================== //

/**
 * Function to display Weekly summary of the employees for a particular property
 * @param {{
 *    isLoading: Boolean, // Boolean to check loading state
 *    monthData: Array, // List of whole month's weeks data for each employee
 *    setWeekId: Function, // Function to set weekId
 *    setWeekMonth: Function, // Function to set week of the month
 *    selectedProperty: String, // Selected property eg: carry over stories, Complexity
 *    selectedWeekMonth: String, // Selected week of the month
 *    selectedEmployee: String, // Selected employee
 *    setSelectedEmployee: Function, // Function to set employee
 *    selectedWeek: String, // Selected week
 *    setSelectedWeek: String, // Function to set week
 *    emplyee1Employee: String, // Employee for employee 1
 *    setEmplyee1Employee: Function, // Function to set employee for employee 1
 *    weeks: Array, // List of weeks of the selected month
 * }}
 */
const ComparisonChart = ({
  isLoading,
  selectedProperty,
  monthData,
  setWeekId,
  setWeekMonth,
  selectedWeekMonth,
  selectedEmployee,
  setSelectedEmployee,
  selectedWeek,
  setSelectedWeek,
  emplyee1Employee,
  setEmplyee1Employee,
  weeks,
  employees,
  setEmployees,
  pageInitialized,
  setPageInitialized,
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
  // Initial value of chart
  let chartValueObjects = {};
  let chartValueForEmplyee1Objects = {};

  const theme = useTheme();
  const [month, setMonth] = useState();
  const customization = useSelector((state) => state.customization);
  const [chartValueData, setChartValueData] = useState(weeklyEmployeeObject);
  const [employee1Label, setEmployee1Label] = useState();
  const [employee2Label, setEmployee2Label] = useState();
  const [chartEmplyee1ValueData, setChartEmplyee1ValueData] =
    useState(weeklyEmployeeObject);
  const [modifiedWeeks, setModifiedWeeks] = useState([]);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    if (employees.length > 1) {
      setEmplyee1Employee(employees[0]._id);
      setEmployee1Label(employees[0].name);
      setEmployee2Label(employees[1].name);
      setSelectedEmployee(employees[1]._id);
      setSelectedWeek('week1');
      setPageInitialized(true);
    }
    // Removing 'All weeks' from weeks
    let weeksList = JSON.parse(JSON.stringify(weeks));
    if (
      weeksList &&
      weeksList.length > 0 &&
      weeksList.includes(constants.labels.allWeeks)
    ) {
      weeksList.pop();
    }
    setModifiedWeeks(weeksList);
  }, []);

  /**
   * Function to compute values for the emplyee1 filters of the chart
   * @param {Array} weeksArray
   * @param {String} week
   * @param {String} employeeId
   * @param {String} employeeType
   */
  const computeData = (weeksArray, week, employeeId, employeeType) => {
    if (employeeType == constants.employeeTypeEmployee1) {
      resetChartValuesForEmplyee1s();
    } else {
      resetChartValues();
    }
    let chartValueDataCopy = {
      carryover_stories: 0,
      complexity: 0,
      prs_merged: 0,
      new_stories_assigned: 0,
      stories_completed: 0,
      story_deficit: 0,
      notable_comments: 0,
    };
    for (const item of weeksArray) {
      // If week does not exist than add the sum of each property of all months
      // TODO: Modifying the data against particular week and employee
      if (week && !employeeId) {
        if (item.week === week) {
          // Merge Arrays
          chartValueForEmplyee1Objects.carryover_stories.push(
            ...item.carryover_stories
          );
          chartValueForEmplyee1Objects.prs_merged.push(...item.prs_merged);
          chartValueForEmplyee1Objects.notable_comments.push(
            ...item.notable_comments
          );
          chartValueForEmplyee1Objects.new_stories_assigned.push(
            ...item.new_stories_assigned
          );
          chartValueForEmplyee1Objects.stories_completed.push(
            ...item.stories_completed
          );
          chartValueForEmplyee1Objects.complexity += item.complexity;
          chartValueForEmplyee1Objects.story_deficit += item.story_deficit;
        }
      } else if (employeeId && !week && item.employee?._id === employeeId) {
        chartValueForEmplyee1Objects.carryover_stories.push(
          ...item.carryover_stories
        );
        chartValueForEmplyee1Objects.prs_merged.push(...item.prs_merged);
        chartValueForEmplyee1Objects.new_stories_assigned.push(
          ...item.new_stories_assigned
        );
        chartValueForEmplyee1Objects.stories_completed.push(
          ...item.stories_completed
        );
        chartValueForEmplyee1Objects.notable_comments.push(
          ...item.notable_comments
        );
        chartValueForEmplyee1Objects.complexity = item.complexity;
        chartValueForEmplyee1Objects.story_deficit = item.story_deficit;
      } else if (week && employeeId) {
        if (item.week === week && item.employee?._id === employeeId) {
          chartValueForEmplyee1Objects.carryover_stories =
            item.carryover_stories;
          chartValueForEmplyee1Objects.prs_merged = item.prs_merged;
          chartValueForEmplyee1Objects.new_stories_assigned =
            item.new_stories_assigned;
          chartValueForEmplyee1Objects.stories_completed =
            item.stories_completed;
          chartValueForEmplyee1Objects.notable_comments = item.notable_comments;
          chartValueForEmplyee1Objects.complexity = item.complexity;
          chartValueForEmplyee1Objects.story_deficit = item.story_deficit;
        }
      } else {
        chartValueForEmplyee1Objects.carryover_stories.push(
          ...item.carryover_stories
        );
        chartValueForEmplyee1Objects.prs_merged.push(...item.prs_merged);
        chartValueForEmplyee1Objects.new_stories_assigned.push(
          ...item.new_stories_assigned
        );
        chartValueForEmplyee1Objects.stories_completed.push(
          ...item.stories_completed
        );
        chartValueForEmplyee1Objects.notable_comments.push(
          ...item.notable_comments
        );
        chartValueForEmplyee1Objects.complexity += item.complexity;
        chartValueForEmplyee1Objects.story_deficit += item.story_deficit;
      }
    }
    chartValueDataCopy.carryover_stories =
      chartValueForEmplyee1Objects.carryover_stories.length;
    chartValueDataCopy.prs_merged =
      chartValueForEmplyee1Objects.prs_merged.length;
    chartValueDataCopy.new_stories_assigned =
      chartValueForEmplyee1Objects.new_stories_assigned.length;
    chartValueDataCopy.stories_completed =
      chartValueForEmplyee1Objects.stories_completed.length;
    chartValueDataCopy.notable_comments =
      chartValueForEmplyee1Objects.notable_comments.length;
    chartValueDataCopy.complexity = chartValueForEmplyee1Objects.complexity;
    chartValueDataCopy.story_deficit =
      chartValueForEmplyee1Objects.story_deficit;
    if (employeeType == constants.employeeTypeEmployee1) {
      setChartEmplyee1ValueData(chartValueDataCopy);
    } else {
      setChartValueData(chartValueDataCopy);
    }

    // State is not updating in chartData thats why passing dummy value to update the chart with latest data
    chartData.options.testKey = 'some property';
  };

  /**
   * Function to reset chartValueData
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

  /**
   * Function to reset chartValueData for employees
   */
  const resetChartValuesForEmplyee1s = () => {
    setChartEmplyee1ValueData({
      carryover_stories: 0,
      complexity: 0,
      prs_merged: 0,
      new_stories_assigned: 0,
      stories_completed: 0,
      story_deficit: 0,
      notable_comments: 0,
    });
    chartValueForEmplyee1Objects = {
      carryover_stories: [],
      complexity: 0,
      prs_merged: [],
      new_stories_assigned: [],
      stories_completed: [],
      story_deficit: 0,
      notable_comments: [],
    };
  };
  let chartData = {
    height: '100%',
    width: '100%',
    type: 'bar',
    options: {
      noData: {
        text:
          selectedEmployee && emplyee1Employee
            ? constants.noDataMessage.noData
            : constants.noDataMessage.missingEmployee,
        align: 'center',
        verticalAlign: 'middle',
      },
      chart: {
        id: 'bar-chart',
        stacked: true,
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: true,
        },
        noData: {
          text: 'No data text',
          align: 'center',
          verticalAlign: 'middle',
        },
      },
      responsive: [
        {
          breakpoint: 1000,
          options: {
            plotOptions: {
              bar: {
                horizontal: false,
              },
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
      testKey: 'testKey', // For chart data updation
      chart: {
        background: colorConstants.chartPrimaryColor,
        foreColor: colorConstants.labelsColor,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: getPercentWidth(
            constants.barChartWidth,
            constants.chartsCategories.employeeChartCategories?.length * 2,
            constants.barChartBarWidth
          ),
          borderRadius: 30,
        },
      },
      xaxis: {
        type: 'category',
        categories: constants.chartsCategories.employeeChartCategories,
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
      fill: { opacity: 1 },
      dataLabels: {
        enabled: false,
      },
      grid: {
        show: true,
      },
    },

    series: [
      {
        name: employee1Label,
        data:
          chartEmplyee1ValueData?.carryover_stories.length > 0 || // If no data is found then assign empty array to display noData label
          chartEmplyee1ValueData?.complexity ||
          chartEmplyee1ValueData?.carryover_stories.length > 0 ||
          chartEmplyee1ValueData?.new_stories_assigned.length > 0 ||
          chartEmplyee1ValueData?.stories_completed.length > 0 ||
          chartEmplyee1ValueData?.prs_merged.length > 0 ||
          chartEmplyee1ValueData?.story_deficit
            ? [
                chartEmplyee1ValueData?.carryover_stories,
                chartEmplyee1ValueData?.complexity,
                chartEmplyee1ValueData?.prs_merged,
                chartEmplyee1ValueData?.new_stories_assigned,
                chartEmplyee1ValueData?.stories_completed,
                chartEmplyee1ValueData?.story_deficit,
              ]
            : [],
      },
      {
        name: employee2Label,
        data:
          chartValueData?.carryover_stories.length > 0 ||
          chartValueData?.complexity ||
          chartValueData?.carryover_stories.length > 0 ||
          chartValueData?.new_stories_assigned.length > 0 ||
          chartValueData?.stories_completed.length > 0 ||
          chartValueData?.prs_merged.length > 0 ||
          chartValueData?.story_deficit
            ? [
                chartValueData?.carryover_stories,
                chartValueData?.complexity,
                chartValueData?.prs_merged,
                chartValueData?.new_stories_assigned,
                chartValueData?.stories_completed,
                chartValueData?.story_deficit,
              ]
            : [],
      },
    ],
  };

  /**
   * Function to return employee name with given id
   * @param {String} employeeId
   */
  const getEmployeeName = (employeeId) => {
    return [...employees]
      .filter((employe) => employe._id === employeeId)
      .map((employe) => {
        return employe.name;
      })[0];
  };

  /**
   * Function to handle employee change
   * @param {String} employee1
   */
  const handleEmplyee1EmployeeChange = (employee1) => {
    setEmplyee1Employee(employee1);
    selectedProperty(null, null);
    // Setting employee 1 label to be displayed in the bar chart
    setEmployee1Label(getEmployeeName(employee1));
  };

  /**
   * Handles week change
   * @param {String} week
   */
  const handleWeekChange = (week) => {
    setSelectedWeek(week);
  };

  /**
   * Function to clear filter
   */
  const clearFilter = () => {
    resetChartValuesForEmplyee1s();
    resetChartValues();
    setSelectedWeek(null);
    setSelectedEmployee(null);
    setEmplyee1Employee(null);
    setMonth(null);
    setWeekMonth(null);
    setEmployees([]);
  };

  /**
   * Function to apply filter
   */
  const applyFilter = () => {
    if (selectedEmployee) {
      computeData(
        monthData,
        selectedWeek,
        emplyee1Employee,
        constants.employeeTypeEmployee1
      );
      computeData(
        monthData,
        selectedWeek,
        selectedEmployee,
        constants.employeeTypeEmployee
      );
      setExpanded(false);
    }
  };

  /**
   * Handles month change
   * @param {String} month
   */
  const handleMonthChange = (month) => {
    setMonth(month);
    setWeekMonth(month);
  };

  /**
   * Function to handle employee change
   * @param {String} employee
   */
  const handleEmployeeChange = (employee) => {
    setSelectedEmployee(employee);
    setEmployee2Label(getEmployeeName(employee));
  };

  /**
   * Function to handle accordian change=
   */
  const handleAccordianChange = () => () => {
    setExpanded(expanded ? false : true);
  };

  return (
    <>
      {isLoading ? (
        <BarChart />
      ) : (
        <ChartMainCard>
          <Grid container spacing={gridSpacing}>
            <AccordionGrid container item xs={12}>
              <StyledAccordion
                expanded={expanded}
                onChange={handleAccordianChange()}
              >
                <AccordionSummary
                  expandIcon={<StyledExpandMoreIcon />}
                  aria-controls='panel2a-content'
                  id='panel2a-header'
                >
                  <Typography container color={colorConstants.labelsColor}>
                    <Typography>
                      <MonthAndWeekTypographyGrid>
                        <StyledFilterDiv>Filter:</StyledFilterDiv>
                        <EmployeesFilterDiv>
                          {
                            [...constants.months]
                              .filter(
                                (employe) => employe.value === selectedWeekMonth
                              )
                              .map((employe) => {
                                return employe.label;
                              })[0]
                          }
                        </EmployeesFilterDiv>
                        {selectedWeekMonth && selectedWeek ? (
                          <EmployeesFilterDiv>|</EmployeesFilterDiv>
                        ) : null}

                        <EmployeesFilterDiv>{selectedWeek}</EmployeesFilterDiv>
                      </MonthAndWeekTypographyGrid>
                      {emplyee1Employee && selectedEmployee && !expanded ? (
                        <EmployeeTypography>
                          <EmployeesFilterDiv>
                            {employee1Label}
                          </EmployeesFilterDiv>
                          <ComparisonIconDiv>
                            <CompareArrowsIcon />{' '}
                          </ComparisonIconDiv>
                          <EmployeesFilterDiv>
                            {employee2Label}
                          </EmployeesFilterDiv>
                        </EmployeeTypography>
                      ) : null}
                    </Typography>
                  </Typography>
                </AccordionSummary>
                <StyledAccordionDetails>
                  <Grid container>
                    <Select
                      menuPlacement='auto'
                      menuPosition='fixed'
                      placeholder='Month'
                      styles={themeConstants.comparisonChartSelectCustomStyles}
                      value={
                        selectedWeekMonth
                          ? constants.months.find(
                              (month) => month.value === selectedWeekMonth
                            )
                          : null
                      }
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
                      styles={themeConstants.comparisonChartSelectCustomStyles}
                      placeholder='Week'
                      value={
                        selectedWeek && modifiedWeeks.length > 0
                          ? {
                              value: selectedWeek,
                              label: selectedWeek,
                            }
                          : null
                      }
                      options={modifiedWeeks.map((week) => {
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
                      styles={themeConstants.comparisonChartSelectCustomStyles}
                      placeholder='Employee 1'
                      disabled={!selectedEmployee}
                      value={
                        emplyee1Employee
                          ? {
                              ...employees
                                .filter(
                                  (employe) => employe._id === emplyee1Employee
                                )
                                .map((employe) => {
                                  return {
                                    value: emplyee1Employee,
                                    label: employe.name,
                                  };
                                })[0],
                            }
                          : null
                      }
                      options={employees
                        .filter((employee) => {
                          return (
                            employee._id !== selectedEmployee &&
                            employee._id !== emplyee1Employee
                          );
                        })
                        .map((employee) => {
                          return {
                            value: employee._id,
                            label: employee.name,
                          };
                        })}
                      onChange={(e) => {
                        handleEmplyee1EmployeeChange(e.value);
                      }}
                    />
                    <Select
                      menuPlacement='auto'
                      menuPosition='fixed'
                      styles={themeConstants.comparisonChartSelectCustomStyles}
                      placeholder='Employee 2'
                      disabled={!selectedEmployee}
                      value={
                        selectedEmployee
                          ? {
                              ...employees
                                .filter(
                                  (employe) => employe._id === selectedEmployee
                                )
                                .map((employe) => {
                                  return {
                                    value: selectedEmployee,
                                    label: employe.name,
                                  };
                                })[0],
                            }
                          : null
                      }
                      options={employees
                        .filter((employee) => {
                          return (
                            employee._id !== emplyee1Employee &&
                            employee._id !== selectedEmployee
                          );
                        })
                        .map((employee) => {
                          return {
                            value: employee._id,
                            label: employee.name,
                          };
                        })}
                      onChange={(e) => {
                        handleEmployeeChange(e.value);
                      }}
                    />
                    <InvitationButton
                      disabled={
                        !emplyee1Employee &&
                        !selectedEmployee &&
                        !selectedWeek &&
                        !selectedWeekMonth
                      }
                      variant='outlined'
                      onClick={(e) => {
                        clearFilter();
                      }}
                    >
                      Clear
                    </InvitationButton>
                    <InvitationButton
                      variant='outlined'
                      disabled={
                        !emplyee1Employee ||
                        !selectedEmployee ||
                        !selectedWeek ||
                        !selectedWeekMonth
                      }
                      onClick={(e) => {
                        applyFilter();
                      }}
                    >
                      Apply
                    </InvitationButton>
                  </Grid>
                </StyledAccordionDetails>
              </StyledAccordion>
            </AccordionGrid>
            <StyledChartGrid item xs={12}>
              {(chartEmplyee1ValueData?.carryover_stories.length > 0 ||
                chartEmplyee1ValueData?.complexity ||
                chartEmplyee1ValueData?.new_stories_assigned.length > 0 ||
                chartEmplyee1ValueData?.stories_completed.length > 0 ||
                chartEmplyee1ValueData?.prs_merged.length > 0 ||
                chartEmplyee1ValueData?.story_deficit) &&
              (chartValueData?.carryover_stories.length > 0 ||
                chartValueData?.complexity ||
                chartValueData?.carryover_stories.length > 0 ||
                chartValueData?.new_stories_assigned.length > 0 ||
                chartValueData?.stories_completed.length > 0 ||
                chartValueData?.prs_merged.length > 0 ||
                chartValueData?.story_deficit) ? (
                <Chart {...chartData} />
              ) : (
                <NoDataGridForComparisonChart item xs={12}>
                  <NoDataFoundTyopgraphy>
                    {selectedEmployee && emplyee1Employee
                      ? constants.noDataMessage.noData
                      : constants.noDataMessage.missingEmployee}
                  </NoDataFoundTyopgraphy>
                </NoDataGridForComparisonChart>
              )}
            </StyledChartGrid>
          </Grid>
        </ChartMainCard>
      )}
    </>
  );
};
ComparisonChart.propTypes = {
  isLoading: PropTypes.bool,
};

export default ComparisonChart;
