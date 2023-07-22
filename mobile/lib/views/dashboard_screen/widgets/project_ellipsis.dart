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

// Flutter imports
import 'package:flutter/material.dart';

// Constant imports
import 'package:heimdall/constants/values.dart';
import 'package:heimdall/constants/color_values.dart';
import 'package:heimdall/constants/assets.dart';

// Component imports
import 'package:heimdall/views/dashboard_screen/widgets/popup_menu_item.dart';

class ProjectEllipsis extends StatelessWidget {
  final Function selectedItem;
  const ProjectEllipsis({
    required this.selectedItem,
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return PopupMenuButton<ProjectMenu>(
      color: ColorValues.primaryTextColor,
      onSelected: (ProjectMenu item) {
        selectedItem(item.name);
      },
      icon: Icon(
        IconsList.moreIcon,
        color: ColorValues.primaryTextColor,
      ),
      itemBuilder: (BuildContext context) => <PopupMenuEntry<ProjectMenu>>[
        PopupMenuItem<ProjectMenu>(
          value: ProjectMenu.addProject,
          child: CustomMenuItem(
            title: Values.addProject,
            icon: IconsList.addProject,
          ),
        ),
        PopupMenuItem<ProjectMenu>(
          value: ProjectMenu.editProject,
          child: CustomMenuItem(
            title: Values.editProject,
            icon: IconsList.editProject,
          ),
        ),
        PopupMenuItem<ProjectMenu>(
          value: ProjectMenu.deleteProject,
          child: CustomMenuItem(
            title: Values.deleteProject,
            icon: IconsList.deleteProject,
          ),
        ),
      ],
    );
  }
}
