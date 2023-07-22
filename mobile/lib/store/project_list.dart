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

// 3rd party imports
import 'package:flutter_bloc/flutter_bloc.dart';

class ProjectList extends Cubit<List<dynamic>> {
  ProjectList() : super([]);

  // Method will be used to store the list of projects
  // List of Projects object will be passed and stored in Bloc State Management
  void saveProjects(projectList) => emit(projectList);
}
