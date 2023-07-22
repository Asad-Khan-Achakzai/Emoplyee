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

class MockData {
  static const weekly = [
    {
      'id': 1,
      'week': 'week1',
      'month': 'Jan',
      'start_Date': '01-01-2022',
      'end_Date': '07-01-2022',
      'employee': {'id': 1, 'name': 'Aqib Naveed'},
      'story_deficit': 1,
      'complexity': 2.1,
      'carryover_stories': [
        {
          'id': 2,
          'name': 'Mobile - Implement Login with Xgrid account only',
          'url': 'https://xgridinc.atlassian.net/browse/EM-13',
          'complexity': 1.7,
        },
        {
          'id': 6,
          'name': 'Mobile - Implement Property Chart',
          'url': 'https://xgridinc.atlassian.net/browse/EM-14',
          'complexity': 4.3,
        },
      ],
      'prs_merged': [
        {
          'name': 'UI - Design Login Screen',
          'url': 'https://gerrit.xgrid.co/c/employee-metrics/+/16160',
        },
        {
          'name': 'UI - Design Property Chart Screen',
          'url': 'https://gerrit.xgrid.co/c/employee-metrics/+/16161',
        },
        {
          'name': 'UI - Design Employee Chart',
          'url': 'https://gerrit.xgrid.co/c/employee-metrics/+/16162',
        },
        {
          'name': 'UI - Design Monthly Screen',
          'url': 'https://gerrit.xgrid.co/c/employee-metrics/+/16163',
        },
        {
          'name': 'UI - Detail Widget of Property',
          'url': 'https://gerrit.xgrid.co/c/employee-metrics/+/16164',
        },
      ],
      'new_stories_assigned': [
        {
          'id': 3,
          'name': 'Mobile - Design Charts Dashboard Screen',
          'url': 'https://xgridinc.atlassian.net/browse/EM-15',
          'complexity': 1.2,
        },
        {
          'id': 4,
          'name': 'Flutter - Read data from Excel file',
          'url': 'https://xgridinc.atlassian.net/browse/EM-16',
          'complexity': 1.3,
        }
      ],
      'stories_completed': [
        {
          'id': 1,
          'name': 'Flutter - Design Login screen',
          'url': 'https://xgridinc.atlassian.net/browse/EM-17',
          'complexity': 1.8,
        },
      ],
    },
    {
      'id': 2,
      'week': 'week2',
      'month': 'Jan',
      'start_Date': '01-01-2022',
      'end_Date': '07-01-2022',
      'employee': {'id': 1, 'name': 'Aqib Naveed'},
      'story_deficit': 4,
      'complexity': 4.1,
      'carryover_stories': [
        {
          'id': 2,
          'name': 'Mobile - Implement Login to Google',
          'url': 'https://xgridinc.atlassian.net/browse/EM-18',
          'complexity': 1.7,
        },
        {
          'id': 2,
          'name': 'Mobile - Send login access code to Api',
          'url': 'https://xgridinc.atlassian.net/browse/EM-19',
          'complexity': 1.7,
        },
        {
          'id': 2,
          'name': 'Mobile - Implement Logout',
          'url': 'https://xgridinc.atlassian.net/browse/EM-20',
          'complexity': 1.7,
        },
        {
          'id': 6,
          'name': 'Mobile - Get Api data for week',
          'url': 'https://xgridinc.atlassian.net/browse/EM-21',
          'complexity': 4.3,
        },
      ],
      'prs_merged': [
        {
          'name': 'Mobile - Implement Login to Google',
          'url': 'https://gerrit.xgrid.co/c/employee-metrics/+/16165',
        },
        {
          'name': 'UI - Send login access code to Api',
          'url': 'https://gerrit.xgrid.co/c/employee-metrics/+/16166',
        },
        {
          'name': 'UI -Implement Logout',
          'url': 'https://gerrit.xgrid.co/c/employee-metrics/+/16167',
        },
        {
          'name': 'Mobile - Get Api data for property week',
          'url': 'https://gerrit.xgrid.co/c/employee-metrics/+/16168',
        },
        {
          'name': 'Mobile - Get Api data for employee week',
          'url': 'https://gerrit.xgrid.co/c/employee-metrics/+/16169',
        },
      ],
      'new_stories_assigned': [
        {
          'id': 3,
          'name': 'Mobile - Fix chart state changed bug',
          'url': 'https://xgridinc.atlassian.net/browse/EM-22',
          'complexity': 2.5,
        },
        {
          'id': 4,
          'name': 'Flutter - Read data from Excel file',
          'url': 'https://xgridinc.atlassian.net/browse/EM-23',
          'complexity': 5.4,
        },
        {
          'id': 5,
          'name': 'Mobile - Change properties to readable form',
          'url': 'https://xgridinc.atlassian.net/browse/EM-24',
          'complexity': 2.5,
        },
        {
          'id': 6,
          'name': 'Flutter - Convert data to json file',
          'url': 'https://xgridinc.atlassian.net/browse/EM-25',
          'complexity': 1.8,
        }
      ],
      'stories_completed': [
        {
          'id': 5,
          'name': 'Mobile - Change properties to readable form',
          'url': 'https://xgridinc.atlassian.net/browse/EM-24',
          'complexity': 2.5,
        },
        {
          'id': 6,
          'name': 'Flutter - Convert data to json file',
          'url': 'https://xgridinc.atlassian.net/browse/EM-25',
          'complexity': 1.8,
        }
      ],
    },
    {
      'id': 3,
      'week': 'week1',
      'month': 'Jan',
      'start_Date': '01-01-2022',
      'end_Date': '07-01-2022',
      'employee': {'id': 2, 'name': 'Asad Khan'},
      'story_deficit': 5,
      'complexity': 3.1,
      'carryover_stories': [
        {
          'id': 2,
          'name': 'UI - Basic structure of UI',
          'url': 'https://xgridinc.atlassian.net/browse/EM-26',
          'complexity': 1.7,
        },
        {
          'id': 6,
          'name': 'API - Basic structure of API',
          'url': 'https://xgridinc.atlassian.net/browse/EM-27',
          'complexity': 4.3,
        },
      ],
      'prs_merged': [
        {
          'name': 'UI - Design Login Screen',
          'url': 'https://gerrit.xgrid.co/c/employee-metrics/+/16170',
        },
        {
          'name': 'UI - Design Login Screen',
          'url': 'https://gerrit.xgrid.co/c/employee-metrics/+/16171',
        },
      ],
      'new_stories_assigned': [
        {
          'id': 3,
          'name': 'API - Added endpoint for Login',
          'url': 'https://xgridinc.atlassian.net/browse/EM-28',
          'complexity': 1.5,
        },
        {
          'id': 4,
          'name': 'UI - Design Login Page',
          'url': 'https://xgridinc.atlassian.net/browse/EM-29',
          'complexity': 1.3,
        },
        {
          'id': 3,
          'name': 'UI - Design Dashboard Screen for web',
          'url': 'https://xgridinc.atlassian.net/browse/EM-30',
          'complexity': 1.5,
        },
        {
          'id': 4,
          'name': 'API - Excel file seeding',
          'url': 'https://xgridinc.atlassian.net/browse/EM-31',
          'complexity': 1.3,
        },
        {
          'id': 3,
          'name': 'API - Monthly report Api',
          'url': 'https://xgridinc.atlassian.net/browse/EM-32',
          'complexity': 1.5,
        },
      ],
      'stories_completed': [
        {
          'id': 3,
          'name': 'API - Monthly report Api',
          'url': 'https://xgridinc.atlassian.net/browse/EM-32',
          'complexity': 1.5,
        },
      ],
    },
    {
      'id': 4,
      'week': 'week2',
      'month': 'Jan',
      'start_Date': '01-01-2022',
      'end_Date': '07-01-2022',
      'employee': {'id': 2, 'name': 'Asad Khan'},
      'story_deficit': 2,
      'complexity': 6.1,
      'carryover_stories': [
        {
          'id': 3,
          'name': 'API - Added endpoint for Login',
          'url': 'https://xgridinc.atlassian.net/browse/EM-28',
          'complexity': 1.5,
        },
        {
          'id': 4,
          'name': 'UI - Design Login Page',
          'url': 'https://xgridinc.atlassian.net/browse/EM-29',
          'complexity': 1.3,
        },
      ],
      'prs_merged': [
        {
          'name': 'api - get monthly properties list',
          'url': 'https://gerrit.xgrid.co/c/employee-metrics/+/16172',
        },
      ],
      'new_stories_assigned': [
        {
          'id': 2,
          'name': 'API - get employees list',
          'url': 'https://xgridinc.atlassian.net/browse/EM-33',
          'complexity': 1.7,
        },
        {
          'id': 2,
          'name': 'API - get properties list',
          'url': 'https://xgridinc.atlassian.net/browse/EM-34',
          'complexity': 1.7,
        },
        {
          'id': 6,
          'name': 'api - get monthly properties list',
          'url': 'https://xgridinc.atlassian.net/browse/EM-35',
          'complexity': 4.3,
        },
      ],
      'stories_completed': [
        {
          'id': 3,
          'name': 'API - Added endpoint for Login',
          'url': 'https://xgridinc.atlassian.net/browse/EM-28',
          'complexity': 1.5,
        },
        {
          'id': 4,
          'name': 'UI - Design Login Page',
          'url': 'https://xgridinc.atlassian.net/browse/EM-29',
          'complexity': 1.3,
        },
        {
          'id': 6,
          'name': 'api - get monthly properties list',
          'url': 'https://xgridinc.atlassian.net/browse/EM-35',
          'complexity': 4.3,
        },
      ],
    },
    {
      'id': 5,
      'week': 'week1',
      'month': 'Jan',
      'start_Date': '01-01-2022',
      'end_Date': '07-01-2022',
      'employee': {'id': 3, 'name': 'Fahad Jalal'},
      'story_deficit': 2,
      'complexity': 5.7,
      'carryover_stories': [
        {
          'id': 2,
          'name': 'API - File seed bug issues',
          'url': 'https://xgridinc.atlassian.net/browse/EM-36',
          'complexity': 1.7,
        },
        {
          'id': 6,
          'name': 'API - Reading Year from File name',
          'url': 'https://xgridinc.atlassian.net/browse/EM-37',
          'complexity': 4.3,
        },
        {
          'id': 6,
          'name': 'API - Implementing weekly list as generic',
          'url': 'https://xgridinc.atlassian.net/browse/EM-38',
          'complexity': 4.3,
        },
      ],
      'prs_merged': [
        {
          'name': 'API - Implementing weekly list as generic',
          'url': 'https://gerrit.xgrid.co/c/employee-metrics/+/16173',
        },
        {
          'name': 'API - Reading Year from File name',
          'url': 'https://gerrit.xgrid.co/c/employee-metrics/+/16174',
        },
      ],
      'new_stories_assigned': [
        {
          'id': 3,
          'name': 'API - Storing data for Monthly collection',
          'url': 'https://xgridinc.atlassian.net/browse/EM-39',
          'complexity': 1.5,
        },
        {
          'id': 4,
          'name': 'API - Extracting the engineer name',
          'url': 'https://xgridinc.atlassian.net/browse/EM-40',
          'complexity': 1.3,
        },
        {
          'id': 3,
          'name': 'API - Fix bug in File seeding',
          'url': 'https://xgridinc.atlassian.net/browse/EM-41',
          'complexity': 1.5,
        },
      ],
      'stories_completed': [
        {
          'id': 3,
          'name': 'API - Fix bug in File seeding',
          'url': 'https://xgridinc.atlassian.net/browse/EM-41',
          'complexity': 1.5,
        },
      ],
    },
    {
      'id': 6,
      'week': 'week2',
      'month': 'Jan',
      'start_Date': '01-01-2022',
      'end_Date': '07-01-2022',
      'employee': {'id': 3, 'name': 'Fahad Jalal'},
      'story_deficit': 2,
      'complexity': 1.1,
      'carryover_stories': [
        {
          'id': 3,
          'name': 'API - Storing data for Monthly collection',
          'url': 'https://xgridinc.atlassian.net/browse/EM-39',
          'complexity': 1.5,
        },
        {
          'id': 4,
          'name': 'API - Extracting the engineer name',
          'url': 'https://xgridinc.atlassian.net/browse/EM-40',
          'complexity': 1.3,
        },
      ],
      'prs_merged': [
        {
          'name': 'API - Extracting the engineer name',
          'url': 'https://gerrit.xgrid.co/c/employee-metrics/+/16175',
        },
      ],
      'new_stories_assigned': [
        {
          'id': 3,
          'name': 'API - Make unique user entry in database',
          'url': 'https://xgridinc.atlassian.net/browse/EM-41',
          'complexity': 2.5,
        },
        {
          'id': 6,
          'name': 'API - Return object from reference',
          'url': 'https://xgridinc.atlassian.net/browse/EM-42',
          'complexity': 1.8,
        },
      ],
      'stories_completed': [
        {
          'id': 6,
          'name': 'API - Return object from reference',
          'url': 'https://xgridinc.atlassian.net/browse/EM-42',
          'complexity': 1.8,
        },
      ],
    },
  ];

  static const monthly = [
    {
      '_id': '1',
      'month': 'Jan',
      'year': 2022,
      'employee': {'id': 1, 'name': 'Aqib Naveed'},
      'total_story_points': 5,
      'epics': 2,
      'ttr_ratio': 1.4,
      'sprint_velocity': 2.9,
      'total_prs_merged': 3,
    },
    {
      '_id': '2',
      'month': 'Feb',
      'year': 2022,
      'employee': {'id': 1, 'name': 'Aqib Naveed'},
      'total_story_points': 6,
      'epics': 3,
      'ttr_ratio': 1.9,
      'sprint_velocity': 3.1,
      'total_prs_merged': 2,
    },
    {
      '_id': '3',
      'month': 'Jan',
      'year': 2022,
      'employee': {'id': 2, 'name': 'Asad Khan'},
      'total_story_points': 9,
      'epics': 1,
      'ttr_ratio': 2.9,
      'sprint_velocity': 1.7,
      'total_prs_merged': 2,
    },
    {
      '_id': '4',
      'month': 'Feb',
      'year': 2022,
      'employee': {'id': 2, 'name': 'Asad Khan'},
      'total_story_points': 4,
      'epics': 2,
      'ttr_ratio': 1.2,
      'sprint_velocity': 2.5,
      'total_prs_merged': 5,
    },
    {
      '_id': '5',
      'month': 'Jan',
      'year': 2022,
      'employee': {'id': 3, 'name': 'Fahad Jalal'},
      'total_story_points': 5,
      'epics': 1,
      'ttr_ratio': 2.8,
      'sprint_velocity': 1.6,
      'total_prs_merged': 3,
    },
    {
      '_id': '6',
      'month': 'Feb',
      'year': 2022,
      'employee': {'id': 3, 'name': 'Fahad Jalal'},
      'total_story_points': 4,
      'epics': 3,
      'ttr_ratio': 0.7,
      'sprint_velocity': 2.3,
      'total_prs_merged': 4,
    },
  ];

  static const projectList = [
    {
      '_id': '001',
      'name': 'Heimdall App',
      'description':
          'The App will be giving the useful information by displaying the charts of Employee performance, for the provided date range.',
      'projectMember': [
        {
          '_id': 'user001',
          'name': 'Aqib Naveed',
          'email': 'aqib.naveed@xgrid.co',
          'picture':
              'https://lh3.googleusercontent.com/a/AItbvml4JrEvn1BX3khs_vz9gZcP-O2nkeh2-4MuUP8x=s96-c',
          'type': 'admin',
          'status': 1,
          'projectIn': [
            {
              'projectId': '001',
              'role': 'projectManager',
            },
          ],
        },
        {
          '_id': 'user002',
          'name': 'Asad Khan',
          'email': 'asad.khan@xgrid.co',
          'picture':
              'https://d1muf25xaso8hp.cloudfront.net/https%3A%2F%2Fs3.amazonaws.com%2Fappforest_uf%2Ff1512936020165x278911292087286720%2FA.png?w=&h=&auto=compress&dpr=1&fit=max',
          'status': 0,
          'projectIn': [
            {
              'projectId': '001',
              'role': 'user',
            },
          ],
        },
        {
          '_id': 'user003',
          'name': 'Fahad Jalal',
          'email': 'fahad.jalal@xgrid.co',
          'picture':
              'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Eo_circle_pink_letter-f.svg/1024px-Eo_circle_pink_letter-f.svg.png',
          'status': 1,
          'projectIn': [
            {
              'projectId': '001',
              'role': 'user',
            },
            {
              'projectId': '003',
              'role': 'user',
            },
          ],
        },
      ],
    },
    {
      '_id': '002',
      'name': 'Purple Cow',
      'description':
          'This app will redesign the Xgrid Solutions. It will contain new theme.',
      'projectMember': [
        {
          '_id': 'user004',
          'name': 'Abdul Haseeb',
          'email': 'abdul.haseeb@xgrid.co',
          'picture':
              'https://media.istockphoto.com/vectors/letter-h-monogram-monoline-trendy-style-outline-initial-emblem-white-vector-id836634598?k=20&m=836634598&s=612x612&w=0&h=rYErLZCsWmTnoh_Z3MBDp79ZKNyyukGC52Q5QI_Oy2U=',
          'type': 'admin',
          'status': 1,
          'projectIn': [
            {
              'projectId': '002',
              'role': 'projectManager',
            },
          ],
        },
        {
          '_id': 'user005',
          'name': 'Tayyab Ali Awan',
          'email': 'tayyab.awan@xgrid.co',
          'picture':
              'https://ih1.redbubble.net/image.1554231105.0192/st,small,845x845-pad,1000x1000,f8f8f8.jpg',
          'status': 1,
          'projectIn': [
            {
              'projectId': '002',
              'role': 'user',
            },
          ],
        },
      ],
    },
    {
      '_id': '003',
      'name': 'USIS',
      'description':
          'This is an Andorid, iOS, iPad and Desktop App usefull for managing the crew workload management.',
      'projectMember': [
        {
          '_id': 'user003',
          'name': 'Fahad Jalal',
          'email': 'fahad.jalal@xgrid.co',
          'picture':
              'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Eo_circle_pink_letter-f.svg/1024px-Eo_circle_pink_letter-f.svg.png',
          'status': 1,
          'projectIn': [
            {
              'projectId': '001',
              'role': 'user',
            },
            {
              'projectId': '003',
              'role': 'user',
            },
          ],
        },
        {
          '_id': 'user006',
          'name': 'Anees Iqbal',
          'email': 'anees.iqbal@xgrid.co',
          'picture':
              'https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs/115448020/original/e4d1c78373e79b822a366754f996fc743017bb28/create-a-simple-1-letter-profile-pic-with-a-shiny-coloured-background.jpg',
          'status': 1,
          'projectIn': [
            {
              'projectId': '003',
              'role': 'projectManager',
            },
          ],
        },
        {
          '_id': 'user007',
          'name': 'Bilal Akhtar',
          'email': 'bilal.akhtar@xgrid.co',
          'picture':
              'https://www.prestashop.com/forums/uploads/monthly_2017_10/b-letter.thumb.png.18d7c54d1fb09b5ba6fae88f5a4ff9db.png',
          'status': 1,
          'projectIn': [
            {
              'projectId': '003',
              'role': 'user',
            },
          ],
        },
        {
          '_id': 'user008',
          'name': 'Abdul Qadar',
          'email': 'abdul.qadar@xgrid.co',
          'picture':
              'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_256,w_256,f_auto,q_auto:eco,dpr_1/v1455902561/vw80giyhu78vdbihjlxg.png',
          'status': 1,
          'projectIn': [
            {
              'projectId': '003',
              'role': 'user',
            },
          ],
        },
      ],
    }
  ];
}
