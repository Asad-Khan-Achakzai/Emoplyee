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
import * as React from 'react';

// Material imports
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import PieChartIcon from '@mui/icons-material/PieChart';

// Constant imports
import { constants } from '../constants/constants';
/**
 * Radio button that switches between charts(bar chart and pie chart)
 * @param {{
 *    radioButton: String, // Radio button value: 'bar' for bar chart and 'pie' for pie chart
 *    setRadioButton: Function, // Function to set radioButtons's value
 * }}
 */
export const ChartSwitch = ({ radioButton, setRadioButton }) => {
  /**
   * Function to handle change in radio button
   * @param {Event} event
   */
  const handleChartSwitching = (event) => {
    setRadioButton(event.target.value);
  };
  return (
    <FormControl>
      <RadioGroup
        row
        aria-labelledby='demo-row-radio-buttons-group-label'
        name='row-radio-buttons-group'
        value={radioButton}
        onChange={handleChartSwitching}
      >
        <FormControlLabel
          value={constants.chartTypes.barChart}
          control={
            <Radio
              checkedIcon={<SignalCellularAltIcon />}
              icon={<SignalCellularAltIcon />}
            />
          }
        />
        <FormControlLabel
          value={constants.chartTypes.pieChart}
          control={
            <Radio checkedIcon={<PieChartIcon />} icon={<PieChartIcon />} />
          }
        />
      </RadioGroup>
    </FormControl>
  );
};
