import React from "react";
import PropTypes from "prop-types";
import LinearProgress from "@material-ui/core/LinearProgress";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import RefreshIcon from "@material-ui/icons/Refresh";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  }
});

const Loading = props => {
  const { error, retry, timedOut, pastDelay, classes } = props;
  if (error) {
    return (
      <div>
        <Typography>Error! </Typography>
        <Button onClick={retry} className={classes.button}>
          Retry
          <RefreshIcon className={classes.rightIcon} />
        </Button>
      </div>
    );
  } else if (timedOut) {
    return (
      <div>
        <Typography>Taking a long time... </Typography>
        <Button onClick={retry} className={classes.button}>
          Retry
          <RefreshIcon className={classes.rightIcon} />
        </Button>
      </div>
    );
  } else if (pastDelay) {
    return <LinearProgress />;
  } else {
    return null;
  }
};

Loading.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Loading);
