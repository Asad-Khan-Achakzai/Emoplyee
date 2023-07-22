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

// NPM imports
const mongoose = require('mongoose');
const { to } = require('await-to-js');
const reader = require('xlsx');

// Model Imports
const UserStory = mongoose.model('UserStory');
const Week = mongoose.model('Week');
const Employee = mongoose.model('Employee');
const Month = mongoose.model('Month');
const Project = mongoose.model('Project');

// App dependencies
const { winstonLog } = require('../common/common');
const constants = require('../../config/constants');
const UserStoryConstant = require('./userStory.constants');
const userStoryConstants = require('./userStory.constants');

/**
 * Function to create an object based on keys and values array
 * @param {Object} propertiesList // List of keys
 * @param {Object} propertiesDataList // list of values
 * @param {Boolean} summary
 * @returns {Object} obj
 */
const arrayToObject = (propertiesList, propertiesDataList, summary = false) => {
  let weekCount = 1;
  let uniqueProperties = [];
  const obj = {};
  let dataObj = {};

  for (let i = 0; i < propertiesList.length; i += 1) {
    if (propertiesList[i] === userStoryConstants.sheetData.engineerName) {
      obj[propertiesList[i]] = propertiesDataList[i];
    } else {
      if (!uniqueProperties.includes(propertiesList[i])) {
        uniqueProperties.push(propertiesList[i]);
        if (summary) {
          obj[propertiesList[i]] = propertiesDataList[i];
        } else {
          dataObj[propertiesList[i]] = propertiesDataList[i];
        }
      } else {
        uniqueProperties.length = 0;
        weekCount += 1;
        dataObj = {};
        uniqueProperties.push(propertiesList[i]);
        if (summary) {
          obj[propertiesList[i]] = propertiesDataList[i];
        } else {
          dataObj[propertiesList[i]] = propertiesDataList[i];
        }
      }
      if (!summary) {
        obj[`week${weekCount}`] = dataObj;
      }
    }
  }

  return obj;
};

/**
 * Function to create employee object
 * @param {String} employeeString
 * @returns {Object}
 */
const createEmployeeObject = (employeeString, project) => {
  const employeeArray = employeeString.split('[');
  return ({
    name: employeeArray[0],
    email: employeeArray[1].replace(']', ''),
    project_in: [{ project_id: String(project._id), project_name: project.name, role: 'User' }],
  });
};

/**
 * Function to save employee in database
 * @param {Object} employee
 * @returns {Object} employeeResult
 */
const saveEmployeeToDb = async (req, employee) => {
  winstonLog(req, constants.logLevel.info, `Saving employee: ${employee.email} in database`);
  const [employeeError, employeeResult] = await to(
    Employee.findOneAndUpdate(
      {
        email: employee.email,
      },
      {
        $set: employee,
      },
      {
        upsert: true,
        new: true,
      },
    ),
  );
  if (employeeError) {
    winstonLog(req, constants.logLevel.error, `Error in saving employee: ${employee.email} in database Error:${employeeError}`);
  }
  return employeeResult;
};

/**
 * Function to create summary object
 * @param {Object} summaryObject
 * @param {String} employeeID
 * @returns {Object}
 */
const createSummaryObject = (summaryObject, employeeID) => ({
  total_story_points: summaryObject.TotalStoryPoints,
  epics: summaryObject.Epics,
  ttr_ratio: summaryObject.TTRRatio,
  sprint_velocity: summaryObject.SprintVelocity,
  employee: employeeID,
  month: summaryObject.monthName,
  year: summaryObject.year,
  project_id: String(summaryObject.project._id), // converting ObjectId into string
  total_prs_merged: summaryObject.TotalPRsMerged,
});

/**
 * Helper function to save monthly summary in database.
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @param {Array} summary
 */
const saveMonthSummary = async (req, res, next, summary) => {
  winstonLog(req, constants.logLevel.info, 'Saving monthly summary in database.');
  for (let index = 0; index < summary.length; index += 1) {
    // Saving employee in database
    const [employeeError, employeeData] = await to(saveEmployeeToDb(
      req,
      createEmployeeObject(summary[index].EngineerName, summary[index].project),
    ));
    // Monthly summary is saved in DB once employee is successfully saved in DB.
    // We need employeeID for reference in monthly summary
    if (employeeData) {
      const summaryObj = createSummaryObject(summary[index], employeeData._id);

      const [summaryError, summaryData] = await to(
        Month.findOneAndUpdate(
          {
            month: summaryObj.month,
            year: summaryObj.year,
            employee: employeeData._id,
            project_id: summaryObj.project_id,
          },
          { $set: summaryObj },
          { upsert: true, new: true },
        ),
      );
      if (summaryError) {
        winstonLog(req, constants.logLevel.error, `Failed to save monthly summary: ${JSON.stringify(summaryObj)} Error: ${summaryError}`);
        res.status(500);
        return next({ msgCode: '2005' });
      }
    } else {
      winstonLog(req, constants.logLevel.error, `Failed to save employee: ${summary[index].EngineerName} Error: ${employeeError}`);
      res.status(500);
      return next({ msgCode: '2006' });
    }
  }
};

/**
* Helper function to create story object
* @param {Object} req
* @param {String} title
* @param {String} url
* @returns
*/
const createUserStoryObject = (req, title, url) => {
  winstonLog(req, constants.logLevel.info, `Creating user story object with title: ${title} and url: ${url}`);
  const userStoryObject = {};
  userStoryObject.url = url.replace(constants.regex.brackets, '');

  const complexity = title.match(constants.regex.complexity);
  title = title.replace(constants.regex.brackets, '').match(constants.regex.text);

  if (complexity !== null) {
    userStoryObject.complexity = complexity[0].replace(constants.regex.brackets, '');
  }
  if (title !== null) {
    userStoryObject.name = title[0].trim();
  }
  winstonLog(req, constants.logLevel.info, `Successfully created user story object with title: ${title} and url: ${url}`);
  return userStoryObject;
};

/**
*
* @param {Object} weekObj
* @param {Object} userStoriesIDs
* @returns
*/
const createWeekObject = (weekObj, userStoriesIDs) => ({
  story_deficit: weekObj.StoryDeficit,
  carryover_stories: userStoriesIDs.carryOverStories,
  employee: weekObj.engineer,
  prs_merged: weekObj.PRsMerged,
  new_stories_assigned: userStoriesIDs.newStoriesAssigned,
  stories_completed: userStoriesIDs.storiesCompleted,
  notable_comments: weekObj.NotableComments,
  complexity: weekObj.TotalStoryPoints_Complexity,
  week: weekObj.week,
  month: weekObj.monthName,
  year: weekObj.year,
  project_id: weekObj.projectID,
});

/**
* Helper function to get user story ids
* @param {Object} story
* @returns {Array}
*/
const findUserStory = async (req, story) => {
  winstonLog(req, constants.logLevel.info, `Fetching user story: ${JSON.stringify(story)}`);
  const [userStoriesListError, userStoriesList] = await to(UserStory.find(
    { url: story.url },
  ).exec());
  if (!userStoriesListError) {
    winstonLog(req, constants.logLevel.info, `User story: ${JSON.stringify(story)} has been fetched successfully`);
    return userStoriesList.map((el) => el._id);
  }
  winstonLog(req, constants.logLevel.error, `Failed to fetch user story: ${JSON.stringify(story)} Error: ${userStoriesListError}`);
};

/**
 * Function to create query object for saving week data
 * @param {*} weekObj
 * @param {*} carryOverStoriesIDs
 * @param {*} savedUserStoriesIDs
 * @param {*} storiesCompletedIDs
 * @returns {Object}
 */
const queryObject = (weekObj, carryOverStoriesIDs, savedUserStoriesIDs, storiesCompletedIDs) => ({
  filter: {
    employee: weekObj.engineer,
    week: weekObj.week,
    month: weekObj.monthName,
    year: weekObj.year,
    project_id: weekObj.projectID,
  },
  data: {
    $set: createWeekObject(weekObj,
      {
        carryOverStories: carryOverStoriesIDs,
        newStoriesAssigned: savedUserStoriesIDs,
        storiesCompleted: storiesCompletedIDs,
      }),
  },
});

/**
 * Function to save week data in database
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @param {Object} weekObj
 */
 const createAndSaveWeekData = async (req, res, next, weekObj) => {
  winstonLog(req, constants.logLevel.info, 'Saving week data in database');
  weekObj = JSON.parse(weekObj);
  const carryOverStoriesIDs = [];
  const storiesCompletedIDs = [];
  const savedUserStoriesIDs = [];
  const saveNewUserStories = new Promise((resolve, reject) => {
    weekObj.NewStoriesAssigned.forEach(async (story, index) => {
      const [saveUserStoriesError, savedUserStories] = await to(
        UserStory.findOneAndUpdate(
          { url: story.url },
          { $set: story },
          { upsert: true, new: true }
        )
      );
      if (!saveUserStoriesError) {
        savedUserStoriesIDs.push(savedUserStories._id);
      }
      if (index === weekObj.NewStoriesAssigned.length - 1) {
        resolve();
      }
    });
  });
  saveNewUserStories.then(() => {
    const saveCarryOverStories = new Promise((resolve, reject) => {
      weekObj.CarryOverStories.forEach(async (story, index) => {
        const [carryOverStoryError, carryOverStory] = await to(
          UserStory.findOneAndUpdate(
            { url: story.url },
            { $set: story },
            { upsert: true, new: true }
          )
        );

        if (!carryOverStoryError) {
          carryOverStoriesIDs.push(carryOverStory._id);
        }

        if (index === weekObj.CarryOverStories.length - 1) {
          resolve();
        }
      });
    });
    saveCarryOverStories.then(() => {
      const saveStoriesCompleted = new Promise((resolve, reject) => {
        weekObj.StoriesCompleted.forEach(async (story, index) => {
          const [storiesCompletedError, storiesCompleted] = await to(
            UserStory.findOneAndUpdate(
              { url: story.url },
              { $set: story },
              { upsert: true, new: true }
            )
          );
          if (!storiesCompletedError) {
            storiesCompletedIDs.push(storiesCompleted._id);
          }
          if (index === weekObj.StoriesCompleted.length - 1) {
            resolve();
          }
        });
      });
      saveStoriesCompleted.then(async () => {
        const queryObj = queryObject(
          weekObj,
          carryOverStoriesIDs,
          savedUserStoriesIDs,
          storiesCompletedIDs
        );
        const [saveWeekDataError, saveWeekData] = await to(
          Week.findOneAndUpdate(queryObj.filter, queryObj.data, {
            upsert: true,
            new: true,
          })
        );
        if (saveWeekDataError) {
          winstonLog(
            req,
            constants.logLevel.error,
            `Failed to save week data Error: ${saveWeekDataError}`
          );
          res.status(500);
          return next({ msgCode: '2007' });
        }
      });
    });
  });
};

/**
 * Helper function to create list of week objects
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @param {Object} month
 */
const createWeekList = async (req, res, next, month) => {
  winstonLog(req, constants.logLevel.info, 'Creating list of week data');
  const weekKeys = Object.keys(month);
  const WeekObject = {};

  const employeeObj = createEmployeeObject(month.EngineerName, month.project);
  const [employeeError, employee] = await to(Employee.findOne({ email: employeeObj.email }));
  if (employee) {
    weekKeys.forEach((week) => {
      if (!userStoryConstants.nonWeekKeys.includes(week) && week !== null) {
        const weekData = month[week];
        WeekObject.week = week;
        WeekObject.engineer = employee._id;
        WeekObject.monthName = month.monthName;
        WeekObject.year = month.year;
        WeekObject.projectID = month.project._id;

        const weekDataKeys = Object.keys(weekData);
        weekDataKeys.forEach((key) => {
          if (key === userStoryConstants.sheetData.carryOverStories
            || key === userStoryConstants.sheetData.newStoriesAssigned
            || key === userStoryConstants.sheetData.storiesCompleted
            || key === userStoryConstants.sheetData.prsMerged) {
              const storyObjectList = [];
              const afterRemovingSlashR = weekData[key].replace(constants.regex.removeSlashR, '');
              let userSotryList = afterRemovingSlashR.split('\n');
              userSotryList = userSotryList.filter((el) => el !== '');

            for (let i = 2; i < userSotryList.length + 2; i += 2) {
              storyObjectList.push(createUserStoryObject(req, userSotryList[i - 2], userSotryList[i - 1]));
            }

            WeekObject[key] = storyObjectList;
          } else if (key === userStoryConstants.sheetData.notableComments) {
            const notableCommentsList = [];
            weekData[key].split('\n').forEach((comment) => {
              comment = comment.match(constants.regex.comment);
              if (comment !== null) {
                notableCommentsList.push(comment[0].trim());
              }
            });
            WeekObject[key] = notableCommentsList;
          } else {
            WeekObject[key] = weekData[key];
          }
        });
        winstonLog(req, constants.logLevel.info, 'List of week data has been created successfully');
        createAndSaveWeekData(req, res, next, JSON.stringify(WeekObject));
      }
    });
  } else {
    winstonLog(req, constants.logLevel.error, `Failed to save employee: ${month.EngineerName} Error: ${employeeError}`);
    res.status(500);
    return next({ msgCode: '2006' });
  }
};

/**
 * Function to loop week data and save it in database
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @param {Object} month
 */
const saveWeekData = async (req, res, next, month) => {
  for (let index = 0; index < month.length; index += 1) {
    createWeekList(req, res, next, month[index]);
  }
};

/**
 * Function to read and save month summary and week data
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 */
const saveExcelSheetDataInDB = async (req, res, next) => {
  let file;
  winstonLog(req, constants.logLevel.info, `Getting excel file: ${req.files.excelFile.name}`);
  try {
    file = reader.readFile(`${req.files.excelFile.tempFilePath}`);
  } catch (error) {
    winstonLog(req, constants.logLevel.error, `Failed to get file: ${req.files.excelFile.name} Error: error`);
  }
  const year = req.files.excelFile.name.match(constants.regex.year)[0];
  const projectName = req.files.excelFile.name.split('_')[1];

  winstonLog(req, constants.logLevel.info, `Fetching project: ${projectName}`);
  const [projectError, project] = await to(Project.find({ name: projectName }));
  if (projectError || !project.length) {
    winstonLog(req, constants.logLevel.error, projectError ? `Failed to fetch project: ${projectName} Error: ${projectError}` : `Failed to fetch project: ${projectName} Error: No data found`);
    res.status(500);
    return next({ msgCode: '2009' });
  }
  winstonLog(req, constants.logLevel.info, `Project: ${projectName} has been fetched successfully.`);
  const weekData = [];
  const summaryData = [];
  const sheets = file.SheetNames;
  let summaryIndex = 0;

  winstonLog(req, constants.logLevel.info, `Reading data from excel file: ${req.files.excelFile.name}`);
  sheets.forEach((sheet) => {
    if (sheet !== UserStoryConstant.sheet.legend) {
      const sheetData = reader.utils.sheet_to_json(file.Sheets[sheet], { header: 1 });
      // extracting week data and store it in a separate list
      for (let i = 2; i < sheetData.length; i += 1) {
        if (sheetData[i].length && sheetData[i][0] !== userStoryConstants.sheetData.summary) {
          const week = arrayToObject(sheetData[1], sheetData[i]);
          week.monthName = sheet;
          week.year = year;
          week.project = project[0];
          weekData.push(week);
        }
        // if data in sheet is equal to "summary" it means week data is completed and monthly summary data is started
        // so ending this loop here and store index value
        if (sheetData[i][0] === userStoryConstants.sheetData.summary) {
          summaryIndex = i;
          break;
        }
      }
      // extracting monthly summary and store it in a separate list.
      for (let i = summaryIndex + 3; i < sheetData.length; i += 1) {
        if (sheetData[i].length) {
          const summary = arrayToObject(sheetData[summaryIndex + 1], sheetData[i], true);
          summary.monthName = sheet;
          summary.year = year;
          summary.project = project[0];
          summaryData.push(summary);
        }
      }
    }
  });
  winstonLog(req, constants.logLevel.info, `Successfully read data from excel file: ${req.files.excelFile.name}`);

  const [savedSummaryError, savedSummary] = await to(saveMonthSummary(req, res, next, summaryData));
  if (savedSummaryError) {
    winstonLog(req, constants.logLevel.error, `Failed to save monthly summary Error: ${savedSummaryError}`);
    res.status(500);
    return next({ msgCode: '2005' });
  }

  const [savedWeekError, savedWeek] = await to(saveWeekData(req, res, next, weekData));
  if (savedWeekError) {
    winstonLog(req, constants.logLevel.error, `Failed to save week data Error: ${savedWeekError}`);
    res.status(500);
    return next({ msgCode: '2007' });
  }
};

module.exports = {
  saveExcelSheetDataInDB,
};
