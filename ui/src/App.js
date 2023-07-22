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
// React imports
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Styling imports
import './App.css';

// Default Theme
import themes from './themes/index';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

// Component imports
import { Login } from './pages/Login/Login';
import { Navbar } from './components/navbar/Navbar.js';
import Dashboard from './pages/Home/dashboard/index';
import { DashboardScreen } from './pages/Home/dashboard/dashboard';
import { ProtectedRoute } from './components/guards/ProtectedRoute.js';
import { LoginRedirectRoute } from './components/guards/ProtectedRoute.js';

// Constant imports
import { constants } from './constants/constants.js';

/**
 *  Container for all other components
 */
function App() {
  const customization = useSelector((state) => state.customization);

  return (
    <ThemeProvider theme={themes(customization)}>
      <CssBaseline />
      {window.location.pathname !== '/' ? <Navbar /> : null}
      <Routes>
        <Route path='/' element={<LoginRedirectRoute component={Login} />} />
        <Route
          path={constants.routes.dashboard}
          element={<ProtectedRoute component={DashboardScreen} />}
        />
        <Route
          path={constants.routes.home}
          element={<ProtectedRoute component={Dashboard} />}
        />
        <Route path='/home/:name&:token' element={<Dashboard />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
