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
import { useEffect, useState, forwardRef } from 'react';

// Material imports
import { Grid, MenuItem, TextField, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

// Component imports
import DetailCard from './detailCard';
import WeekPropertiesChart from './weekPropertiesChart';
import WeekEmployeeChart from './weekEmployeeChart';
import { gridSpacing } from '../../../constants/constants';
import MonthlySummaryChart from './monthlySummaryChart';
import { AlertDialog } from '../../../components/dialogBox/addNotAbleComment';
import ComparisonChart from './comparisonChart';
import { NoDataFound } from './noDataFound';

// Service import
import {
  addNotableCommentToDb,
  getEmployeePerformanceByMonth,
  getMonthlySummaryByMonth,
} from '../../../services/userStory.service';

// Constant imports
import { constants } from '../../../constants/constants';
import {
  themeConstants,
  ParentGridOfLoader,
  GridOfLoader,
  StyledCircularProgress,
  ChartTypeGrid,
} from '../../../constants/theme-constants';
import { colorConstants } from '../../../constants/color-constants';

// Third Party imports
import Select from 'react-select';
import moment from 'moment';

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});
let weekDataCounter = 0;
let monthlySummaryDataCounter = 0;

/**
 * Displays dashboard with bar charts
 */
const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);
  const [chartValue, setChartValue] = useState(
    constants.dropDowns.chartTypes[0].value
  );
  const [property, setProperty] = useState(null);
  const [weekId, setWeekId] = useState();
  const [selectedIndexData, setSelectedIndexData] = useState();
  const [weekData, setWeekData] = useState([]);
  const [comparisonEmplyee1WeekData, setComparisonEmplyee1WeekData] = useState(
    []
  );
  const [week, setWeek] = useState(null);
  const [employeeID, setEmployeeID] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [monthlySummaryData, setMonthlySummaryData] = useState([]);
  const [pageInitialized, setPageInitialized] = useState(false);
  const [employee, setEmployee] = useState();
  const [weekDataWeek, setWeekDataWeek] = useState();
  const [emplyee1Employee, setEmplyee1Employee] = useState();
  const [emplyee1Week, setEmplyee1Week] = useState();
  // Month whose all week data is required
  const [selectedWeekMonth, setWeekMonth] = useState(moment().format('MMM'));

  // Selected month from dropdown for a particular chart
  const [selectedMonth, setSelectedMonth] = useState();

  const [getWeekDataForTheFirstTime, setGetWeekDataForTheFirstTime] =
    useState(false);
  const [open, setOpen] = useState(false);
  const [notableComment, setNotableComment] = useState();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState();
  const [severity, setSeverity] = useState('success');
  const [chartType, setChartType] = useState(constants.chartTypes.barChart);
  const [weeks, setWeeks] = useState([]);
  const [monthSubList, setMonthSubList] = useState([]);
  useEffect(() => {
    weekDataCounter = 0;
    monthlySummaryDataCounter = 0;
    setLoading(true);
    getMonthlySummary(
      moment().subtract(monthlySummaryDataCounter, 'month').format('MMM')
    );
  }, []);
  useEffect(() => {
    setOpenSnackbar(true);
  }, [snackBarMessage]);

  /**
   * Function to create a sub list from the month assigned till january
   */
  const getMonthSubList = () => {
    const start = moment().month(selectedWeekMonth);
    let months = constants.months.filter(
      (month) => month.value === selectedWeekMonth
    );
    while (true) {
      if (selectedWeekMonth === constants.months[0].value) {
        break;
      }
      let monthName = start.subtract(1, 'month').format('MMM');
      months.push(constants.months.find((month) => month.value === monthName));
      if (monthName === constants.months[0].value) {
        break;
      }
    }
    setMonthSubList(months);
  };

  /**
   * Get data of current month if no data found then call with privouse month this goes on until data is found for the current year
   */
  const getMonthDataOnMonthChange = () => {
    if (!getWeekDataForTheFirstTime) {
      getWeekData(selectedWeekMonth).then((response) => {
        if (response.length > 0) {
          getMonthSubList();
          setGetWeekDataForTheFirstTime(true);
          setLoading(false);
          setWeekData(response);
          // Getting uniques weeks
          const weeksList = response
            .map((obj) => obj.week)
            .filter(
              (item, index) =>
                response.map((obj) => obj.week).indexOf(item) === index
            )
            .sort();
          if (weeksList && weeksList.length > 0) {
            weeksList.push(constants.labels.allWeeks);
          }
          setWeeks(weeksList);
          setEmployees(getEmployeesList(response));
        } else {
          if (constants.months[0].value != selectedWeekMonth) {
            weekDataCounter = weekDataCounter + 1;
            let month = moment()
              .subtract(weekDataCounter, 'month')
              .format('MMM'); // Getting one month earlier month name
            setWeekMonth(month);
          } else {
            // If no data found for this year till january
            setWeekMonthForTheChart(null);
            setWeeks([]);
            setEmployees([]);
            setLoading(false);
            setGetWeekDataForTheFirstTime(true);
            setSeverity(constants.severities.info);
            setSnackBarMessage(
              constants.toastMessages.weekDataNoDataFoundMessage
            );
          }
        }
      });
    } else {
      getWeekData(selectedWeekMonth).then((response) => {
        setGetWeekDataForTheFirstTime(true);
        setLoading(false);
        setWeekData(response);
        if (response.length > 0) {
          // Getting uniques weeks
          const weeksList = response
            .map((obj) => obj.week)
            .filter(
              (item, index) =>
                response.map((obj) => obj.week).indexOf(item) === index
            )
            .sort();
          if (weeksList && weeksList.length > 0) {
            weeksList.push(constants.labels.allWeeks);
          }
          setWeeks(weeksList);
          setEmployees(getEmployeesList(response));
        } else {
          setWeeks([]);
          setEmployees([]);
        }
      });
    }
  };
  useEffect(() => {
    // Ignore if selectedWeekMonth is empty string
    if (selectedWeekMonth) {
      getMonthDataOnMonthChange();
    }
  }, [selectedWeekMonth]);

  /**
   * Get unique list of the employees
   * @param {Array} listOfObjects
   * @returns list of unique employees
   */
  const getEmployeesList = (listOfObjects) => {
    return listOfObjects
      .map((obj) => obj.employee)
      .reduce((unique, employee) => {
        if (!unique.some((obj) => obj._id === employee._id)) {
          unique.push(employee);
        }
        return unique;
      }, []);
  };

  /**
   * Sets the title in detail card based on the index of bars of the chart
   * Sets the list to be rendered in detail card
   * @param {Number} property
   * @param {Array} selectedIndexData
   */
  const selectedProperty = (property, selectedIndexData) => {
    setSelectedIndexData(selectedIndexData);
    setProperty(property);
  };

  /**
   * Function to handle change of chart select
   * @param {String} value
   */
  const handleChartChange = (value) => {
    setSelectedIndexData(null);
    setChartValue(value);
    setWeekId(null);
  };

  /**
   * Function to send notable comment to dialog box for confirmation
   * @param {String} notableComment
   */
  const addNotableComment = (notableComment) => {
    setOpen(true);
    setNotableComment(notableComment);
  };

  /**
   * Function to add notable comment in database
   * @param {String} notableComment
   */
  const saveNotableComment = (notableComment) => {
    addNotableCommentToDb(notableComment, weekId).then((response) => {
      // Refresh the state with latest data
      if (constants.statusCode.statusSuccess === response.status) {
        setSeverity(constants.severities.success);
        setSnackBarMessage(
          constants.toastMessages.saveNotableCommentSuccessMessage
        );
        let weekDataCopy = [...weekData];
        let objIndex = weekData.findIndex((obj) => obj._id == weekId);
        let selectedIndexDataCopy = [...selectedIndexData];
        selectedIndexDataCopy.push(notableComment);
        weekDataCopy[objIndex].notable_comments = selectedIndexDataCopy;
        setWeekData(weekDataCopy);
        setSelectedIndexData(selectedIndexDataCopy);
        setLoading(false);
      } else {
        setLoading(false);
        setSeverity(constants.severities.error);
        setSnackBarMessage(
          constants.toastMessages.saveNotableCommentErrorMessage
        );
      }
    });
  };

  /**
   * Function to get week data
   */
  const getWeekData = (month) => {
    setSnackBarMessage('');
    return getEmployeePerformanceByMonth(
      employeeID,
      month,
      week,
      property
    ).then((response) => {
      return new Promise((resolve) => {
        if (constants.statusCode.statusSuccess === response.status) {
          setSeverity(constants.severities.success);
          setSnackBarMessage(constants.toastMessages.weekDataSuccessMessage);
          if (response.data.data) {
            resolve(response.data.data);
          }
        } else {
          setLoading(false);
          setSeverity(constants.severities.error);
          setSnackBarMessage(constants.toastMessages.weekDataErrorMessage);
        }
      });
    });
  };

  /**
   * Function to get monthly summary data
   */
  const getMonthlySummary = (month) => {
    getMonthlySummaryByMonth(month).then((response) => {
      if (constants.statusCode.statusSuccess === response.status) {
        if (response.data.data.length > 0) {
          setSelectedMonth(month);
          setSeverity(constants.severities.success);
          setSnackBarMessage(
            constants.toastMessages.monthlySummarySuccessMessage
          );
          setMonthlySummaryData(response.data.data);
          setEmployees(getEmployeesList(response.data.data));
        } else if (constants.months[0].value != month) {
          monthlySummaryDataCounter = monthlySummaryDataCounter + 1;
          let month = moment()
            .subtract(monthlySummaryDataCounter, 'month')
            .format('MMM'); // Getting one month earlier month name
          setSelectedMonth(month);
          getMonthlySummary(month);
        } else {
          setSeverity(constants.severities.info);
          setSnackBarMessage(
            constants.toastMessages.weekDataNoDataFoundMessage
          );
          setMonthlySummaryData([]);
          setEmployees([]);
        }
      } else {
        setSeverity(constants.severities.error);
        setSnackBarMessage(constants.toastMessages.weekDataErrorMessage);
      }
    });
  };

  /**
   * Set month name for the monthly summary chart
   * @param {String} month
   */
  const setMonthNameOfChart = (month) => {
    setSelectedMonth(month);
    setLoading(true);
    setSnackBarMessage('');
    getMonthlySummaryByMonth(month).then((response) => {
      setLoading(false);
      if (response.status === constants.statusCode.statusSuccess) {
        if (response.data.data.length > 0) {
          setSeverity(constants.severities.success);
          setSnackBarMessage(
            constants.toastMessages.monthlySummarySuccessMessage
          );
          setMonthlySummaryData(response.data.data);
          setEmployees(getEmployeesList(response.data.data));
        } else {
          setSeverity(constants.severities.info);
          setSnackBarMessage(
            constants.toastMessages.weekDataNoDataFoundMessage
          );
          setMonthlySummaryData([]);
          setEmployees([]);
        }
      } else {
        setSnackBarMessage(constants.toastMessages.weekDataErrorMessage);
      }
    });
  };

  /**
   * Set month name for the weekly chart
   * @param {String} month
   */
  const setWeekMonthForTheChart = (month) => {
    setWeekMonth(month);
  };

  /**
   * Function to close snackbar
   */
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Grid
      container
      padding='1rem'
      backgroundColor={colorConstants.heimdallPrimaryColor}
      display='inline-table'
      height={constants.NinetyPercentOfViewHeight}
    >
      <Grid item xs={12}>
        {isLoading === true ? (
          <ParentGridOfLoader container spacing={gridSpacing}>
            <GridOfLoader item xs={12} md={8}>
              <StyledCircularProgress disableShrink />
            </GridOfLoader>
          </ParentGridOfLoader>
        ) : (
          <ParentGridOfLoader container spacing={gridSpacing}>
            {weekData.length ? (
              <>
                <Grid
                  item
                  xs={12}
                  md={12}
                  sx={{
                    display: 'flex',
                    justifyContent: selectedIndexData ? 'left' : 'center',
                  }}
                >
                  <Grid md={8}>
                    <ChartTypeGrid item>
                      <Select
                        placeholder='Chart Type'
                        styles={themeConstants.customStyles}
                        menuPlacement='auto'
                        menuPosition='fixed'
                        value={constants.dropDowns.chartTypes.find(
                          (month) => month.value === chartValue
                        )}
                        options={constants.dropDowns.chartTypes}
                        onChange={(e) => {
                          handleChartChange(e.value);
                        }}
                      />
                    </ChartTypeGrid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={8}>
                  {chartValue === constants.dropDowns.chartTypes[1].value ? (
                    <WeekPropertiesChart
                      isLoading={isLoading}
                      monthData={weekData}
                      selectedProperty={selectedProperty}
                      setWeekId={setWeekId}
                      setWeekMonth={setWeekMonthForTheChart}
                      selectedWeekMonth={selectedWeekMonth}
                      chartType={chartType}
                      setChartType={setChartType}
                      employees={employees}
                      weeks={weeks}
                      monthSubList={monthSubList}
                    />
                  ) : null}
                  {chartValue === constants.dropDowns.chartTypes[2].value ? (
                    <MonthlySummaryChart
                      isLoading={isLoading}
                      monthlySummary={monthlySummaryData}
                      employees={employees}
                      setMonth={setMonthNameOfChart}
                      selectedMonth={selectedMonth}
                      monthSubList={monthSubList}
                    />
                  ) : null}
                  {chartValue === constants.dropDowns.chartTypes[0].value ? (
                    <WeekEmployeeChart
                      isLoading={isLoading}
                      selectedProperty={selectedProperty}
                      monthData={weekData}
                      setWeekId={setWeekId}
                      setWeekMonth={setWeekMonthForTheChart}
                      selectedWeekMonth={selectedWeekMonth}
                      employees={employees}
                      weeks={weeks}
                      monthSubList={monthSubList}
                    />
                  ) : null}
                  {chartValue === constants.dropDowns.chartTypes[3].value ? (
                    <ComparisonChart
                      isLoading={isLoading}
                      monthData={weekData}
                      emplyee1MonthData={comparisonEmplyee1WeekData}
                      selectedProperty={selectedProperty}
                      setWeekId={setWeekId}
                      setWeekMonth={setWeekMonthForTheChart}
                      selectedWeekMonth={selectedWeekMonth}
                      selectedEmployee={employee}
                      setSelectedEmployee={setEmployee}
                      selectedWeek={weekDataWeek}
                      setSelectedWeek={setWeekDataWeek}
                      emplyee1Week={emplyee1Week}
                      setEmplyee1Week={setEmplyee1Week}
                      emplyee1Employee={emplyee1Employee}
                      setEmplyee1Employee={setEmplyee1Employee}
                      weeks={weeks}
                      employees={employees}
                      setEmployees={setEmployees}
                      pageInitialized={pageInitialized}
                      setPageInitialized={setPageInitialized}
                      monthSubList={monthSubList}
                    />
                  ) : null}
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={4}
                  sx={{ display: selectedIndexData ? 'block' : 'none' }}
                >
                  {selectedIndexData ? (
                    <DetailCard
                      isLoading={isLoading}
                      property={property}
                      selectedIndexData={selectedIndexData}
                      addNotableComment={addNotableComment}
                      weekId={weekId}
                    />
                  ) : null}
                  <AlertDialog
                    open={open}
                    setOpen={setOpen}
                    saveNotableComment={saveNotableComment}
                    comment={notableComment}
                  />
                  <Snackbar
                    open={openSnackbar}
                    autoHideDuration={constants.toastDuration}
                    onClose={handleCloseSnackbar}
                  >
                    <Alert onClose={handleCloseSnackbar} severity={severity}>
                      {snackBarMessage}
                    </Alert>
                  </Snackbar>
                </Grid>
              </>
            ) : (
              <NoDataFound
                primaryText={constants.labels.noDataFoundForTheYear}
              />
            )}
          </ParentGridOfLoader>
        )}
      </Grid>
    </Grid>
  );
};

export default Dashboard;
