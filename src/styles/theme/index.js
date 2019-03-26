// Make sure this file is import after css import!
import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: {
      main: '#56BDA6',
      contrastText: '#fff',
    },
    secondary: {
      main: '#5F7AE8',
      contrastText: '#fff',
    },
  },
});

export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
};

export const convertColorTheme = props => {
  if (props.color) {
    const colorKey = Object.keys(props.theme.palette).filter(key => {
      return key === props.color;
    });

    if (colorKey && colorKey.length) {
      return props.theme.palette[colorKey] && props.theme.palette[colorKey].main;
    } else {
      return props.color;
    }
  } else {
    return 'lightgrey';
  }
};
