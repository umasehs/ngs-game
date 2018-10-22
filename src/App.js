import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Hidden from "@material-ui/core/Hidden";
import Divider from "@material-ui/core/Divider";
import MenuIcon from "@material-ui/icons/Menu";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import GetAppIcon from "@material-ui/icons/GetApp";
import { gameRelatedListItems, otherListItems } from "./drawerListItems";
import Loadable from "react-loadable";
import Loading from "./Loading";
import logo from "./projectLogo.png";
import { SizeMe } from "react-sizeme";

const LoadablePhaserContainer = Loadable({
  loader: () => import("./PhaserContainer"),
  loading: Loading,
  timeout: 10000 // 10 seconds
});

const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: "100%",
    zIndex: 1,
    overflow: "hidden",
    position: "relative",
    display: "flex",
    width: "100%"
  },
  appBar: {
    position: "absolute",
    marginLeft: drawerWidth,
    [theme.breakpoints.up("md")]: {
      width: `calc(100% - ${drawerWidth}px)`
    }
  },
  navIconHide: {
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    [theme.breakpoints.up("md")]: {
      position: "relative"
    }
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3
  },
  appLogo: {
    animation: "App-logo-spin infinite 20s linear",
    height: "24px",
    marginLeft: "4px"
  },
  "@keyframes App-logo-spin": {
    from: { transform: "rotate(0deg)" },
    to: { transform: "rotate(360deg)" }
  },
  tall: {
    height: "100%"
  }
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileOpen: false,
      a2hsPrompt: false,
      deferredPrompt: null
    };
    LoadablePhaserContainer.preload();
  }

  addToHomeScreen = () => {
    // Hide our user interface that shows our A2HS button
    this.setState({ a2hsPrompt: false });

    const deferredPrompt = this.state.deferredPrompt;
    if (deferredPrompt) {
      // Show the prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then(choiceResult => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the A2HS prompt");
        } else {
          console.log("User dismissed the A2HS prompt");
        }
        this.setState({ deferredPrompt: null });
      });
    }
  };

  handleBeforeInstallPrompt = e => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later, and
    // update UI to notify the user they can add to home screen.
    this.setState({ deferredPrompt: e, a2hsPrompt: true });
  };

  componentDidMount() {
    window.addEventListener(
      "beforeinstallprompt",
      this.handleBeforeInstallPrompt
    );
  }

  componentWillUnmount() {
    window.removeEventListener(
      "beforeinstallprompt",
      this.handleBeforeInstallPrompt
    );
  }

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  render() {
    const { classes, theme } = this.props;

    const drawer = (
      <div>
        <div className={classes.toolbar} />
        <Divider />
        <List>{gameRelatedListItems}</List>
        <Divider />
        <List>{otherListItems}</List>
        <Divider />
        <Collapse in={this.state.a2hsPrompt}>
          <List>
            <ListItem button onClick={this.addToHomeScreen}>
              <ListItemIcon>
                <GetAppIcon />
              </ListItemIcon>
              <ListItemText primary="Add to home" />
            </ListItem>
          </List>
        </Collapse>
      </div>
    );

    return (
      <React.Fragment>
        <CssBaseline />
        <div className={classes.root}>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={this.handleDrawerToggle}
                className={classes.navIconHide}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="title" color="inherit" noWrap>
                NGS Game
              </Typography>
              <img src={logo} className={classes.appLogo} alt="logo" />
            </Toolbar>
          </AppBar>
          <Hidden mdUp>
            <Drawer
              variant="temporary"
              anchor={theme.direction === "rtl" ? "right" : "left"}
              open={this.state.mobileOpen}
              onClose={this.handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper
              }}
              ModalProps={{
                keepMounted: true // Better open performance on mobile.
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden smDown implementation="css">
            <Drawer
              variant="permanent"
              open
              classes={{
                paper: classes.drawerPaper
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <main className={classes.content}>
            <div className={classes.toolbar} />
            <SizeMe
              monitorHeight
              render={props => (
                <div className={classes.tall}>
                  <LoadablePhaserContainer {...props} />
                </div>
              )}
            />
          </main>
        </div>
      </React.Fragment>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(App);
