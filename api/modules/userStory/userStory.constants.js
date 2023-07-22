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

module.exports = {
  responseMessages: {
    saveExcelSheetDataInDB: {
      success: 'Excel data has been uploaded successfully.',
      failure: 'Failed to upload data on the server.',
    },
  },
  sheet: {
    legend: 'Legend',
  },
  sheetData: {
    summary: 'Summary',
    engineerName: 'EngineerName',
    carryOverStories: 'CarryOverStories',
    newStoriesAssigned: 'NewStoriesAssigned',
    storiesCompleted: 'StoriesCompleted',
    prsMerged: 'PRsMerged',
    notableComments: 'NotableComments',
    weeks: [{ name: 'week1' }, { name: 'week2' }, { name: 'week3' }, { name: 'week4' }, { name: 'week5' }],
  },
  nonWeekKeys: ['EngineerName', 'monthName', 'year', 'project', 'projectID'],
};
