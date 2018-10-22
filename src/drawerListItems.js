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
    <ListItem
      button
      component="a"
      href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3841808/"
    >
      <ListItemIcon>
        <InfoIcon />
      </ListItemIcon>
      <ListItemText primary="What is NGS?" />
    </ListItem>
    <ListItem
      button
      component="a"
      href="https://www.ebi.ac.uk/training/online/course/ebi-next-generation-sequencing-practical-course/what-you-will-learn/what-next-generation-dna-"
    >
      <ListItemIcon>
        <ZoomInIcon />
      </ListItemIcon>
      <ListItemText primary="Learn more" />
    </ListItem>
  </div>
);

export const otherListItems = (
  <div>
    <ListItem button component="a" href="http://2018.igem.org/Team:McMaster">
      <ListItemIcon>
        <WebIcon />
      </ListItemIcon>
      <ListItemText primary="Our wiki" />
    </ListItem>
    <ListItem button component="a" href="https://www.mgem.ca/">
      <ListItemIcon>
        <LaunchIcon />
      </ListItemIcon>
      <ListItemText primary="Our website" />
    </ListItem>
    <ListItem button component="a" href="mailto:igem@mcmaster.ca">
      <ListItemIcon>
        <EmailIcon />
      </ListItemIcon>
      <ListItemText primary="Email us" />
    </ListItem>
  </div>
);
