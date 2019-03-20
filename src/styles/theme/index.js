// Make sure this file is import after css import!
import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: {
      main: '#19B3B1',
      contrastText: '#fff',
    },
    secondary: {
      main: '#F0483E',
      contrastText: '#fff',
    },
    success: {
      main: '#02C8A7',
      contrastText: '#fff',
    },
    warning: {
      main: '#F9BE02',
      contrastText: '#fff',
    },
    error: {
      main: '#FF646F',
      contrastText: '#fff',
    },
    info: {
      main: '#6057FE',
      contrastText: '#fff',
    },
    facebook: {
      main: '#3d5a96',
    },
    google: {
      main: '#da483f',
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
