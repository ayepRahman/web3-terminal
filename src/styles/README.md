// For example, to override the AppBar (https://material-ui-next.com/api/app-bar/) root class we can do the following:

// First method (override Material UI classnames):
// 1 - Add the property classes in the AppBar component:
//     <AppBar classes={{root: 'my-root-class'}}
// 2 - Override the styles with the styled components:
//     styled(AppBar)`
//       &.my-root-class {
//         z-index: 1500;
//       }
//     `

// Second method (force specificity):
//     styled(AppBar)`
//       && {
//         z-index: 1500;
//       }
//     `

// Third method (use a custom classname):
// 1 - Add the classname in the classname property:
//     <AppBar className={`my-class ${this.props.otherClassesFromPropertiesIfNeeded}`}
// 2 - Override the styles with the styled components:
//     styled(AppBar)`
//       &.my-class {
//         z-index: 1500;
//       }
//     `
