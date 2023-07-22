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

// Material imports
import {
  Avatar,
  Button,
  CssBaseline,
  Divider,
  Paper,
  Box,
  Grid,
  Typography,
  CircularProgress,
  List,
  Accordion,
  AccordionDetails,
  AppBar,
  IconButton,
  ListItemText,
  ListItem,
  Breadcrumbs,
} from '@mui/material';
import MuiLink from '@mui/material/Link';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ErrorIcon from '@mui/icons-material/Error';

// Constant imports
import { constants } from './constants';
import { colorConstants } from './color-constants';
import { styled } from '@mui/material/styles';

// Component imports
import MainCard from '../ui-component/cards/mainCard';

// Third Party imports
import Select from 'react-select';

export const LeftChildGrid = styled(Grid)({
  position: 'relative',
  justifyContent: 'center',
  backgroundColor: 'blue',
  '@media (max-width: 47.938rem)': {
    display: 'none',
  },
});

export const AvatarBox = styled(Box)({
  my: 8,
  mx: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: '10rem',
});

export const StyledAvatar = styled(Avatar)({
  m: 1,
  backgroundColor: colorConstants.heimdallSecondaryColor,
  width: 50,
  height: 50,
});

export const StyledUserAvatar = styled(Avatar)({
  marginLeft: '1rem',
  width: '2.5rem',
  height: '2.5rem',
});

export const GoogleLoginButton = styled(Button)({
  color: colorConstants.menuBackgroundColor,
  backgroundColor: colorConstants.labelsColor,
  fontWeight: 'bold',
  margin: '0.4rem',
  borderRadius: '15rem',
  height: '2.5rem',
  width: '19rem',
  '&:hover': {
    color: colorConstants.labelsColor,
  },
});

export const LoginScreenMainGrid = styled(Grid)({
  height: '100vh',
});

export const StyledDivider = styled(Divider)({
  width: '100%',
  marginTop: '1rem',
  backgroundColor: colorConstants.heimdallSecondaryColor,
});

export const LogoGrid = styled(Grid)({
  backgroundImage: `url(${constants.images.xgridImage})`,
  backgroundRepeat: 'no-repeat',
  filter: 'blur(0.5rem)',
  filter: 'blur(0.25rem)',
  backgroundColor: (t) =>
    t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
  backgroundSize: 'cover',
  backgroundPosition: 'center',
});

export const ButtonBox = styled(Box)({
  marginTop: '5rem',
});

export const StyledCircularProgress = styled(CircularProgress)({
  justifyContent: 'center',
  marginTop: '25%',
});

export const StyledSelect = styled(Select)({
  control: (base, state) => ({
    ...base,
    backgroundColor: colorConstants.chartPrimaryColor,
    color: '', // Overriding default color
    '&:hover': {
      borderColor: colorConstants.menuBackgroundColor,
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: colorConstants.labelsColor,
  }),
  menu: (base) => ({
    ...base,
    color: colorConstants.menuColor,
    backgroundColor: colorConstants.menuBackgroundColor,
    opacity: '80%',
    borderRadius: 0,
    marginTop: 0,
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isFocused ? colorConstants.chartPrimaryColor : null,
  }),
});

export const CustomeImg = styled('img')({
  width: '16rem',
  position: 'absolute',
  top: '50%',
  shadow: '0.625rem 0.625rem 3.125rem var(--logoShadow)',
  shadow: '0.625rem 0.625rem 3.125rem var(--logoShadow)',
  boxShadow: '0.625rem 0.625rem 3.125rem var(--logoShadow)',
});

export const CircularProgressGrid = styled(Grid)({
  textAlign: 'center',
});

export const StyledTypography = styled(Grid)({
  color: colorConstants.labelsColor,
  fontWeight: 'bold',
});

export const DashboardMainGrid = styled(Grid)({
  height: constants.NinetyPercentOfViewHeight,
});

export const DescriptionGrid = styled(Grid)({
  backgroundColor: 'black',
});
export const IconButtonGrid = styled(Grid)({
  textAlign: 'center',
  margin: 'auto',
});

export const TitleGrid = styled(Grid)({
  marginTop: '2rem',
  textAlign: 'justify',
  textJustify: 'interWord',
  textAlign: 'center',
});

export const ButtonGrid = styled(Grid)({
  marginTop: '1rem',
  marginBottom: '1rem',
  textAlign: 'center',
});
export const StyledListItem = styled(ListItem)({
  display: 'inline-table',
});
export const InvitationButton = styled(Button)({
  color: colorConstants.labelsColor,
  border: colorConstants.labelsColor,
  backgroundColor: colorConstants.chartPrimaryColor,
  margin: '0.4rem',
  borderRadius: '0.5rem',
  height: '2.5rem',
  '&:disabled': {
    backgroundColor: colorConstants.menuBackgroundColor,
    borderColor: colorConstants.disabledButtonBoarderColor,
    color: colorConstants.labelsColor,
    filter: 'brightness(80%)',
  },
});

export const EmployeeBox = styled(Box)({
  display: 'block',
  flexDirection: 'column',
});

export const HeadingGrid = styled(Grid)({
  textAlign: 'center',
});

export const DashboardDivider = styled(Divider)({
  textAlign: 'center',
  backgroundColor: colorConstants.heimdallSecondaryColor,
});

export const EmployeesListGridStyle = styled(Grid)({
  textAlign: 'center',
  marginTop: '2rem',
});

export const DashBoardBoxStyel = styled(Box)({
  marginTop: '8rem',
});
export const StyledListItemText = styled(ListItemText)({
  minWidth: '5rem',
  '@media only screen and (max-width: 767px)': {
    maxWidth: '5rem',
    overflowWrap: 'anywhere',
  },
});
export const StyledRoleText = styled(ListItemText)({
  minWidth: '5rem',
  textAlign: 'center',
  '@media only screen and (min-width: 1440px)': {
    marginLeft: '10rem',
  },
});
export const DashboardListStyle = styled(List)({
  width: '100%',
  paddingTop: '3rem',
  maxHeight: '20rem',
  maxWidth: '100%',
  overflow: 'overlay',
  '&::-webkit-scrollbar': {
    width: 0,
  },
  bgcolor: 'background.paper',
  backgroundColor: colorConstants.heimdallPrimaryColor,
  color: colorConstants.labelsColor,
});

export const EmployeeInviteGridStyle = styled(Grid)({
  justifyContent: 'center',
  display: 'flex',
  marginTop: '4rem',
});
export const EmployeeInviteSubGridStyle = styled(Grid)({
  display: 'flex',
  marginLeft: '1rem',
  justifyContent: 'center',
});
export const EmailHelperText = styled(Typography)({
  color: 'red',
  fontSize: 'inherit',
});
export const NoDataFoundGrid = styled(Grid)({
  height: '100%',
  minHeight: '39.6rem',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  '@media only screen and (max-width: 500px)': {
    minHeight: '24rem',
  },
});

export const NoDataGridForComparisonChart = styled(Grid)({
  minHeight: '20rem',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
});
export const NoDataContainer = styled(Grid)({
  backgroundColor: colorConstants.heimdallPrimaryColor,
  height: constants.NinetyPercentOfViewHeight,
});
export const StyledCrossIcon = styled(CloseIcon)({
  color: 'red',
});

export const StyledErrorIcon = styled(ErrorIcon)({
  fontSize: '6rem',
  color: 'Red',
  '@media only screen and (max-width: 500px)': {
    fontSize: '4rem',
  },
});

export const NodataFoundText = styled(Typography)({
  color: colorConstants.labelsColor,
  fontSize: '1.5rem',
  '@media only screen and (max-width: 500px)': {
    fontSize: '1rem',
  },
});
export const NodataFoundSecondaryText = styled(Typography)({
  color: colorConstants.labelsColor,
  fontSize: '1.5rem',
  opacity: '70%',
  '@media only screen and (max-width: 500px)': {
    fontSize: '1rem',
  },
});
export const DescriptionTypography = styled(Typography)({
  marginTop: '1rem',
  textAlign: 'justify',
  textJustify: 'interWord',
  padding: '1rem',
  color: colorConstants.labelsColor,
  maxHeight: '25rem',
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    width: 0,
  },
});

export const NoDataFoundTyopgraphy = styled(Typography)({
  color: colorConstants.labelsColor,
});

export const ParentGridOfLoader = styled(Grid)({
  height: constants.NinetyPercentOfViewHeight,
  justifyContent: 'center',
  backgroundColor: colorConstants.heimdallPrimaryColor,
});

export const GridOfLoader = styled(Grid)({
  textAlign: 'center',
  height: constants.NinetyPercentOfViewHeight,
});

export const ChartTypeGrid = styled(Grid)({
  textAlign: 'center',
  paddingBottom: '1rem',
});
export const MonthAndWeekTypographyGrid = styled(Grid)({
  display: 'flex',
  float: 'left',
});

export const StyledChartGrid = styled(Grid)({
  height: '25rem',
  '@media only screen and (min-width: 2560px)': {
    height: '43rem',
  },
});

export const EmployeeTypography = styled(Typography)({
  display: 'inline-flex',
});
export const ChartMainCard = styled(MainCard)({
  backgroundColor: colorConstants.chartPrimaryColor,
  '@media only screen and (min-width: 2560px)': {
    height: '50rem',
  },
});

export const StyledAccordion = styled(Accordion)({
  backgroundColor: colorConstants.menuBackgroundColor,
});

export const AccordionGrid = styled(Grid)({
  display: 'block',
});

export const StyledExpandMoreIcon = styled(ExpandMoreIcon)({
  color: colorConstants.labelsColor,
});

export const StyledAccordionDetails = styled(AccordionDetails)({
  display: 'flex',
});

export const StyledFilterDiv = styled('div')({
  padding: '0.5rem',
  fontSize: '1.5rem',
});

export const EmployeesFilterDiv = styled('div')({
  padding: '0.5rem',
  marginTop: '0.2rem',
  filter: 'brightness(80%)',
});

export const ComparisonIconDiv = styled('div')({
  marginTop: '0.5rem',
  filter: 'brightness(80%)',
});

export const ChartGrid = styled(Grid)({
  maxHeight: '31.5rem',
});

export const PropertyGrid = styled(Grid)({
  paddingBottom: '2rem',
});

export const DetailCardGrid = styled(Grid)({
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    width: 0,
  },
});

export const DetailCardChildGrid = styled(Grid)({
  paddingRight: '1rem',
});

export const NavbarSelectedProjectGrid = styled(Grid)({
  textAlign: 'center',
  margin: 'auto',
});

export const DetailCardDivider = styled(Divider)({
  marginTop: '0.5rem',
  marginBottom: '0.5rem',
});
export const DashboardCardDivider = styled(Divider)({
  marginTop: '0.5rem',
  marginBottom: '0.5rem',
  backgroundColor: colorConstants.labelsColor,
  height: '0.1rem',
  opacity: '30%',
});
export const StyledAppBar = styled(AppBar)({
  backgroundColor: 'black',
  height: constants.TenPercentOfViewHeight,
});

export const StyledIconButton = styled(IconButton)({
  marginRight: '2rem',
});
export const StyledAddIcon = styled(AddIcon)({
  marginRight: '1rem',
});
export const StyledMoreVertIcon = styled(MoreVertIcon)({
  color: 'white',
});
export const StyledEditIcon = styled(EditIcon)({
  marginRight: '1rem',
});
export const StyledDeleteIcon = styled(DeleteIcon)({
  marginRight: '1rem',
});
export const AppTitle = styled(Typography)({
  color: colorConstants.labelsColor,
  '@media only screen and (max-width: 426px)': {
    fontSize: '0.8rem',
  },
});
export const UserNameGrid = styled(Grid)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'end',
});
export const AppName = styled(Typography)({
  color: colorConstants.labelsColor,
  '@media only screen and (max-width: 426px)': {
    fontSize: '0.8rem',
  },
});
export const StyledBreadcrumbs = styled(Breadcrumbs)({
  margin: '0.5rem',
  '@media only screen and (max-width: 426px)': {
    fontSize: '0.8rem',
  },
});

export const StyledMuiLink = styled(MuiLink)({
  color: colorConstants.labelsColor,
});
export const NavbarBox = styled(Box)({
  height: constants.TenPercentOfViewHeight,
});

export const themeConstants = {
  buttonStyle: { mt: 3, mb: 2, marginTop: '4rem', borderRadius: '3rem' },
  avatarStyle: {
    m: 1,
    backgroundColor: colorConstants.heimdallSecondaryColor,
    width: 50,
    height: 50,
  },
  customStyles: {
    control: (base, { isDisabled }) => ({
      ...base,
      margin: '0.4rem',
      marginRight: '1rem',
      minWidth: '8rem',
      backgroundColor: colorConstants.chartPrimaryColor,
      '&:hover': {
        borderColor: colorConstants.menuBackgroundColor,
      },
      '@media only screen and (max-width: 320px)': {
        minWidth: '12.5rem',
      },
      opacity: isDisabled ? '50%' : '100%',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: colorConstants.labelsColor,
    }),
    menu: (base) => ({
      ...base,
      color: colorConstants.menuColor,
      backgroundColor: colorConstants.menuBackgroundColor,
      opacity: '80%',
      borderRadius: 0,
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => ({
      ...styles,
      backgroundColor: isFocused ? colorConstants.chartPrimaryColor : null,
    }),
  },

  comparisonChartSelectCustomStyles: {
    control: (base, state) => ({
      ...base,
      margin: '0.3rem',
      marginRight: '1rem',
      minWidth: '8rem',
      flex: 1,
      background: colorConstants.menuBackgroundColor,
      color: '', // Overriding default color
      '&:hover': {
        borderColor: colorConstants.menuBackgroundColor,
      },
      '@media only screen and (max-width: 320px)': {
        minWidth: '12.5rem',
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: colorConstants.labelsColor,
    }),
    menu: (base) => ({
      ...base,
      color: colorConstants.menuColor,
      backgroundColor: colorConstants.menuBackgroundColor,
      opacity: '80%',
      borderRadius: 0,
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => ({
      ...styles,
      backgroundColor: isFocused ? colorConstants.chartPrimaryColor : null,
    }),
  },
  employeeInviteTextFieldStyle: {
    marginRight: '1rem',
  },
  dashboardProjectsDropdown: {
    control: (base, state) => ({
      ...base,
      margin: '0.4rem',
      marginRight: '1rem',
      minWidth: '8rem',
      backgroundColor: colorConstants.chartPrimaryColor,
      color: '', // Overriding default color
      '&:hover': {
        borderColor: colorConstants.menuBackgroundColor,
      },
      '@media only screen and (max-width: 320px)': {
        minWidth: '12.5rem',
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: colorConstants.labelsColor,
    }),
    menu: (base) => ({
      ...base,
      color: colorConstants.menuColor,
      backgroundColor: colorConstants.menuBackgroundColor,
      opacity: '80%',
      borderRadius: 0,
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => ({
      ...styles,
      backgroundColor: isFocused ? colorConstants.chartPrimaryColor : null,
    }),
  },
  customStylesOfMemberRole: {
    control: (base, { isDisabled }) => ({
      ...base,
      margin: '0.4rem',
      marginRight: '1rem',
      minWidth: '12rem',

      backgroundColor: colorConstants.chartPrimaryColor,
      '&:hover': {
        borderColor: colorConstants.menuBackgroundColor,
      },
      '@media only screen and (max-width: 320px)': {
        minWidth: '8rem',
      },
      opacity: isDisabled ? '50%' : '100%',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: colorConstants.labelsColor,
    }),
    menu: (base) => ({
      ...base,
      color: colorConstants.menuColor,
      backgroundColor: colorConstants.menuBackgroundColor,
      opacity: '80%',
      borderRadius: 0,
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => ({
      ...styles,
      backgroundColor: isFocused ? colorConstants.chartPrimaryColor : null,
    }),
  },
  customStylesOfInvitationUserType: {
    control: (base, { isDisabled }) => ({
      ...base,
      marginTop: '0.4rem',
      marginRight: '1rem',
      minWidth: '8rem',
      height: '2.5rem',
      fontSize: '0.8rem',
      backgroundColor: colorConstants.chartPrimaryColor,
      '&:hover': {
        borderColor: colorConstants.menuBackgroundColor,
      },
      '@media only screen and (max-width: 320px)': {
        minWidth: '5rem',
        fontSize: '0.4rem',
      },
      opacity: isDisabled ? '50%' : '100%',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: colorConstants.labelsColor,
    }),
    menu: (base) => ({
      ...base,
      color: colorConstants.menuColor,
      backgroundColor: colorConstants.menuBackgroundColor,
      opacity: '80%',
      fontSize: '0.8rem',
      borderRadius: 0,
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => ({
      ...styles,
      backgroundColor: isFocused ? colorConstants.chartPrimaryColor : null,
    }),
  },
};
