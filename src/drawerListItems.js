import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import EmailIcon from "@material-ui/icons/Email";
import WebIcon from "@material-ui/icons/Web";
import InfoIcon from "@material-ui/icons/Info";
import LaunchIcon from "@material-ui/icons/Launch";
import ZoomInIcon from "@material-ui/icons/ZoomIn";

export const gameRelatedListItems = (
  <div>
    <ListItem button>
      <ListItemIcon>
        <InfoIcon />
      </ListItemIcon>
      <ListItemText primary="What is NGS?" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <ZoomInIcon />
      </ListItemIcon>
      <ListItemText primary="Learn more" />
    </ListItem>
  </div>
);

export const otherListItems = (
  <div>
    <ListItem button>
      <ListItemIcon>
        <WebIcon />
      </ListItemIcon>
      <ListItemText primary="Our wiki" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <LaunchIcon />
      </ListItemIcon>
      <ListItemText primary="Our website" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <EmailIcon />
      </ListItemIcon>
      <ListItemText primary="Email us" />
    </ListItem>
  </div>
);
