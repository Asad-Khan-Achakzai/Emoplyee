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
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

// State Management imports
import 'package:heimdall/store/data_cubit.dart';
import 'package:heimdall/store/logged_in_user.dart';
import 'package:heimdall/store/project_list.dart';
import 'package:heimdall/store/current_project.dart';
import 'package:heimdall/store/jwt_token.dart';

// Component imports
import 'package:heimdall/views/login_screen/login_screen.dart';

// Constant imports
import 'package:heimdall/constants/values.dart';

Future main() async {
  await dotenv.load(fileName: '.env');
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider<LoggedInUser>(
          create: (BuildContext context) => LoggedInUser(),
        ),
        BlocProvider<ProjectList>(
          create: (BuildContext context) => ProjectList(),
        ),
        BlocProvider<DataCubit>(
          create: (BuildContext context) => DataCubit(),
        ),
        BlocProvider<CurrentProject>(
          create: (BuildContext context) => CurrentProject(),
        ),
        BlocProvider<JwtToken>(
          create: (BuildContext context) => JwtToken(),
        ),
      ],
      child: MaterialApp(
        debugShowCheckedModeBanner: false,
        title: Values.appName,
        theme: ThemeData(),
        home: const LoginScreen(
          isLoading: true,
        ),
      ),
    );
  }
}
