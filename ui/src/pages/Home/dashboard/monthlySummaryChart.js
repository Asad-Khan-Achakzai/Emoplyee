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
import React from 'react';
import { useState, useEffect } from 'react';

// Material imports
import { Grid, MenuItem, TextField, Typography, Snackbar } from '@mui/material';

// Component imports
import BarChart from '../../../ui-component/cards/Skeleton/barChart';
import MainCard from '../../../ui-component/cards/mainCard';
import { gridSpacing } from '../../../constants/constants';

// Third party imports
import Select from 'react-select';
import Chart from 'react-apexcharts';

// Constant imports
import { constants } from '../../../constants/constants';
import {
  themeConstants,
  ChartMainCard,
  ChartGrid,
  StyledChartGrid,
} from '../../../constants/theme-constants';
import { colorConstants } from '../../../constants/color-constants';

// Function imports
import { getPercentWidth } from './commonFunctions';
/**
 * Displays monthly summary chart
 * @param {{
 *    isLoading: Boolean, // Boolean to check loading state
 *    monthlySummary: Array, // List of whole month's data for each employee
 *    employees: Array, // List of employees
 *    setMonth: Function, // Function to select month
 *    selectedMonth: String, // Selected month from the drop down
 * }}
 */
const MonthlySummaryChart = ({
  isLoading,
  monthlySummary,
  employees,
  setMonth,
  selectedMonth,
  monthSubList,
}) => {
  const monthlySummaryObject = {
    ttr_ratio: 0,
    epics: 0,
    sprint_velocity: 0,
    total_story_points: 0,
    total_prs_merged: 0,
  };
  const [employee, setEmployee] = useState();
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const [barChartData, setBarChartData] = useState(monthlySummaryObject);

  // Initially filter with first employee
  useEffect(() => {
    handleChangeOfEmployee(employees[0]?._id);
  }, []);
  // Chart summary
  const summary = {
    width: constants.barChartWidth,
    options: {
      chart: {
        background: colorConstants.chartPrimaryColor,
        foreColor: colorConstants.labelsColor,
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
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: getPercentWidth(
            constants.barChartWidth,
            constants.chartsCategories.monthlySummaryChartCategories.length,
            constants.barChartBarWidth
          ),
          borderRadius: 30,
        },
      },
      xaxis: {
        type: 'category',
        categories: constants.chartsCategories.monthlySummaryChartCategories,
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

    data: [
      {
        name: '',
        data: [
          barChartData?.ttr_ratio,
          barChartData?.epics,
          barChartData?.sprint_velocity,
          barChartData?.total_story_points,
          barChartData?.total_prs_merged,
        ],
      },
    ],
  };

  /**
   * Function to handle change of employee select
   * @param {String} value
   */
  const handleChangeOfEmployee = (value) => {
    if (monthlySummary.length > 0) {
      setBarChartData(
        monthlySummary.find((month) => month.employee._id === value)
      );
    } else {
      setBarChartData({
        ttr_ratio: 0,
        epics: 0,
        sprint_velocity: 0,
        total_story_points: 0,
        total_prs_merged: 0,
      });
    }
    setEmployee(value);
  };

  /**
   * Function to handle change of month select
   * @param {String} value
   */
  const handleMonthChange = (value) => {
    setMonth(value);
  };

  /**
   * Function to close snackbar
   */
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
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
                  styles={themeConstants.customStyles}
                  placeholder='Month'
                  value={constants.months.find(
                    (month) => month.value === selectedMonth
                  )}
                  options={monthSubList.filter((month) => {
                    if (month.value !== selectedMonth) {
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
                  placeholder='Employee'
                  defaultValue={{
                    value: employees[0]?._id,
                    label: employees[0]?.name,
                  }}
                  options={employees.map((employee) => {
                    return {
                      value: employee._id,
                      label: employee.name,
                    };
                  })}
                  onChange={(e) => {
                    handleChangeOfEmployee(e.value);
                  }}
                />
              </Grid>
            </Grid>
            <StyledChartGrid item xs={12}>
              <Chart
                height='100%'
                options={summary.options}
                series={summary.data}
                type='bar'
              />
            </StyledChartGrid>
          </ChartGrid>
        </ChartMainCard>
      )}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackBarMessage}
      />
    </>
  );
};
export default MonthlySummaryChart;
