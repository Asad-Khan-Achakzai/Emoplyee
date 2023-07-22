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

class UserStory {
  final String id;
  final String name;
  final String url;
  final int complexity;

  const UserStory({
    required this.id,
    this.name = '',
    this.url = '',
    this.complexity = 0,
  });

  UserStory.fromJson(Map<String, dynamic> json)
      : id = json['_id'] ?? '',
        name = json['name'],
        url = json['url'],
        complexity = json['complexity'] ?? 0;

  Map<String, dynamic> toJson() => {
        '_id': id,
        'name': name,
        'url': url,
        'complexity': complexity,
      };
}
