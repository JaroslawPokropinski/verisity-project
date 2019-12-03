import React from 'react';
import PropTypes from 'prop-types';

import {
  List, ListItem, ListItemText, Avatar, ListItemAvatar,
  ListItemSecondaryAction, IconButton, makeStyles
} from '@material-ui/core';
import CheckCircle from '@material-ui/icons/CheckCircle';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  item: {
    width: '100%',
  }
}));

// create dynamic user list for all filtered users
function InvitationList({ pending, acceptFriend }) {
  const classes = useStyles();
  if (pending.length > 0) {
    return (
      <List className={classes.root}>
        {pending.map((user) => (
          <ListItem
            className={classes.item}
            button
            key={user.email}
          >
            <ListItemAvatar>
              <Avatar alt="User icon" src={`https://api.adorable.io/avatars/55/${encodeURIComponent(user.email)}.png`} />
            </ListItemAvatar>
            <ListItemText primary={user.name} />
            <ListItemSecondaryAction>
              <IconButton
                edge="start"
                onClick={(e) => {
                  e.stopPropagation();
                  acceptFriend(user.email);
                }}
              >
                <CheckCircle />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    );
  }

  return (
    <List>
      <ListItem>
        <ListItemText primary="No invitations" />
      </ListItem>
    </List>
  );
}

export default InvitationList;
