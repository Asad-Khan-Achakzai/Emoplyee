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

// This file is not reviewed. Please review it. // TODO will remove this line in next commit
// Mongoose Import
const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
    },
    picture: {
      type: String,
    },
    project_in: {
      type: Array,
    },
    type: {
      type: String,
    },
  },
  { timestamps: true },
);

const Employee = mongoose.model('Employee', EmployeeSchema);

module.exports = Employee;
