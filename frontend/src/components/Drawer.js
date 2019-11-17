import React from 'react';
import PropTypes from 'prop-types';
import Divider from '@material-ui/core/Divider';
import Hidden from '@material-ui/core/Hidden';
import { makeStyles } from '@material-ui/core/styles';
import GDrawer from '@material-ui/core/Drawer';


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
}));


export default function Drawer({
  handleDrawerToggle, mobileOpen, children
}) {
  const classes = useStyles();

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      {React.Children.only(children)}
      {/* <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List> */}
      <Divider />
    </div>
  );

  return (
    <nav className={classes.drawer} aria-label="mailbox folders">
      <Hidden smUp implementation="css">
        <GDrawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {drawer}
        </GDrawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <GDrawer
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent"
          open
        >
          {drawer}
        </GDrawer>
      </Hidden>
    </nav>
  );
}


Drawer.propTypes = {
  handleDrawerToggle: PropTypes.func.isRequired,
  mobileOpen: PropTypes.bool.isRequired,
  children: PropTypes.element.isRequired,
};
