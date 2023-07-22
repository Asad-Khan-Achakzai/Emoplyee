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

// Mongoose Imports
const mongoose = require('mongoose');

const WeekSchema = new mongoose.Schema(
  {
    story_deficit: {
      type: Number,
    },
    carryover_stories: {
      type: Array,
      ref: 'UserStory',
    },
    employee: {
      type: String,
      ref: 'Employee',
    },
    prs_merged: {
      type: Array,
    },
    new_stories_assigned: {
      type: Array,
      ref: 'UserStory',
    },
    stories_completed: {
      type: Array,
      ref: 'UserStory',
    },
    notable_comments: {
      type: Array,
    },
    complexity: {
      type: Number,
    },
    week: {
      type: String,
    },
    month: {
      type: String,
    },
    year: {
      type: Number,
    },
    start_date: {
      type: String,
      default: '',
    },
    end_date: {
      type: String,
      default: '',
    },
    project_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Week = mongoose.model('Week', WeekSchema);

module.exports = Week;
