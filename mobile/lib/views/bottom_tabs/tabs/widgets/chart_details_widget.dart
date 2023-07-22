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

// 3rd Party imports
import 'package:url_launcher/url_launcher.dart';

// Constant imports
import '../../../../constants/assets.dart';
import '../../../../constants/sizes.dart';
import '../../../../constants/color_values.dart';
import '../../../../constants/values.dart';

// Component imports
import './chart_details_widget_for_values.dart';
import 'comment_confirmation_dialog.dart';

class DetailsWidget extends StatefulWidget {
  final String title;
  // Expected data type for itemsList
  // List<Map<String, dynamic>> or Map<String, dynamic>
  // For carryover_stories, prs_merged, and all these a list would be returned.
  // Will check on UI about the type of data returned. In case of List type we will
  // show different widget. In the other case we will show chart_details_widget_for_values
  // that's why dynamic type is used for itemsList.
  final dynamic itemsList;
  final Function apiCall;
  final Function selectedIndexValue;

  const DetailsWidget(
    this.title,
    this.itemsList,
    this.apiCall, {
    Key? key,
    required this.selectedIndexValue,
  }) : super(key: key);

  @override
  State<DetailsWidget> createState() => _DetailsWidgetState();
}

class _DetailsWidgetState extends State<DetailsWidget> {
  TextEditingController newComment = TextEditingController();

  @override
  void initState() {
    super.initState();
  }

  // Method will convert the keys coming from APIs to Readable Form
  // e.g. stories_deficit => Stories Deficit
  String refactorToReadableForm(String label) {
    List<String> labelsList = label.split('_');
    String response = '';

    for (String element in labelsList) {
      // Incase of ttr_ratio => TTR Ratio will be returned
      if (element.contains('ttr')) {
        response += ' ${element.toUpperCase()}';
      }
      // Incase of prs_merged => PRs Merged will be returned
      else if (element.contains('prs')) {
        response +=
            ' ${element.substring(0, 2).toUpperCase()}${element.substring(2)}';
      } else {
        response += ' ${element[0].toUpperCase()}${element.substring(1)}';
      }
    }
    return response.trim();
  }

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;

    return Container(
      margin: const EdgeInsets.fromLTRB(9, 0, 9, 15),
      decoration: BoxDecoration(
        color: ColorValues.primaryTextColor,
        borderRadius: const BorderRadius.all(Radius.circular(20.0)),
      ),
      child: Column(
        children: [
          Container(
            alignment: Alignment.topRight,
            child: IconButton(
              onPressed: () {
                widget.selectedIndexValue(-1);
              },
              color: ColorValues.primary,
              icon: Icon(
                IconsList.closeIcon,
              ),
            ),
          ),
          Expanded(
            child: Container(
              transform: CustomSize.detailTitleTransformValue,
              padding: EdgeInsets.fromLTRB(
                  PaddingSize.charts, 0, PaddingSize.charts, 0),
              child: Column(
                children: [
                  Padding(
                    padding:
                        EdgeInsets.only(bottom: PaddingSize.detailWidgetTitle),
                    child: Text(
                      refactorToReadableForm(widget.title),
                      style: TextStyle(
                        color: ColorValues.secondary,
                        fontSize: FontSize.text,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  Expanded(
                    // Below condition will iterate the User Stories & PRs Merged to show in a ListView
                    // For decimal values like StoryDeficit a separate widget will be used
                    child: widget.itemsList[widget.title] is List
                        ? SizedBox(
                            height: 100,
                            child: ListView.separated(
                                separatorBuilder:
                                    (BuildContext context, int index) =>
                                        Divider(
                                          thickness: 0.15,
                                          indent: screenSize.width *
                                              PaddingSize.twoPercentPadding,
                                          endIndent: screenSize.width *
                                              PaddingSize.twoPercentPadding,
                                          color: ColorValues.primary,
                                        ),
                                physics: const AlwaysScrollableScrollPhysics(),
                                padding:
                                    const EdgeInsets.symmetric(horizontal: 8),
                                itemCount:
                                    widget.itemsList[widget.title].length,
                                itemBuilder: (BuildContext context, int index) {
                                  return widget.title == Values.notableComments
                                      ? Text(
                                          widget.itemsList[widget.title][index]
                                              .toString(),
                                          style: TextStyle(
                                              color: ColorValues
                                                  .secondaryTextColor,
                                              fontWeight: FontWeight.w600),
                                        )
                                      : InkWell(
                                          onTap: () => launchUrl(
                                            Uri.parse(
                                                widget.itemsList[widget.title]
                                                    [index]['url']),
                                            mode:
                                                LaunchMode.externalApplication,
                                          ),
                                          child: Container(
                                            padding: const EdgeInsets.all(10),
                                            child: Column(
                                              crossAxisAlignment:
                                                  CrossAxisAlignment.start,
                                              children: [
                                                Text(
                                                  widget.itemsList[widget.title]
                                                      [index]['name'],
                                                  style: TextStyle(
                                                      color: ColorValues
                                                          .secondaryTextColor,
                                                      fontWeight:
                                                          FontWeight.w600),
                                                ),
                                                // incase of User Stories, this will show complexity of it
                                                // incase of PRs Merged. It will show nothing
                                                if (widget.itemsList[
                                                            widget.title][index]
                                                        ['complexity'] !=
                                                    null)
                                                  Text(
                                                    'Complexity: ${widget.itemsList[widget.title][index]['complexity']}',
                                                    style: TextStyle(
                                                      color: ColorValues
                                                          .secondaryTextColor,
                                                    ),
                                                  ),
                                              ],
                                            ),
                                          ),
                                        );
                                }),
                          )
                        : ChartDetailsWidgetForValues(
                            widget.itemsList, widget.title),
                  ),
                ],
              ),
            ),
          ),
          if (widget.title.contains(Values.comment))
            Container(
              padding: EdgeInsets.symmetric(
                  horizontal: PaddingSize.newCommentHorizontalPadding),
              decoration: BoxDecoration(
                border: Border(
                  top: BorderSide(
                    color: ColorValues.secondaryTextColor,
                  ),
                ),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: newComment,
                      decoration: InputDecoration(
                          hintText: Values.addNewComment,
                          border: InputBorder.none,
                          fillColor: ColorValues.primary),
                    ),
                  ),
                  CommentConfirmationDialog(
                    widget.itemsList,
                    newComment,
                    widget.apiCall,
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}
