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

// Third party imports
import PropTypes from 'prop-types';

// Material imports
import { useTheme } from '@mui/material/styles';
import MuiAvatar from '@mui/material/Avatar';

// Design of Avatar in the project
const Avatar = ({ color, outline, size, sx, ...others }) => {
  const theme = useTheme();

  const colorSX = color &&
    !outline && {
      color: theme.palette.background.paper,
      bgcolor: `${color}.main`,
    };
  const outlineSX = outline && {
    color: color ? `${color}.main` : `primary.main`,
    bgcolor: theme.palette.background.paper,
    border: '2px solid',
    borderColor: color ? `${color}.main` : `primary.main`,
  };
  let sizeSX = {};
  switch (size) {
    case 'badge':
      sizeSX = {
        width: theme.spacing(3.5),
        height: theme.spacing(3.5),
      };
      break;
    case 'xs':
      sizeSX = {
        width: theme.spacing(4.25),
        height: theme.spacing(4.25),
      };
      break;
    case 'sm':
      sizeSX = {
        width: theme.spacing(5),
        height: theme.spacing(5),
      };
      break;
    case 'lg':
      sizeSX = {
        width: theme.spacing(9),
        height: theme.spacing(9),
      };
      break;
    case 'xl':
      sizeSX = {
        width: theme.spacing(10.25),
        height: theme.spacing(10.25),
      };
      break;
    case 'md':
      sizeSX = {
        width: theme.spacing(7.5),
        height: theme.spacing(7.5),
      };
      break;
    default:
      sizeSX = {};
  }

  return (
    <MuiAvatar
      sx={{ ...colorSX, ...outlineSX, ...sizeSX, ...sx }}
      {...others}
    />
  );
};

Avatar.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  outline: PropTypes.bool,
  size: PropTypes.string,
  sx: PropTypes.object,
};

export default Avatar;
