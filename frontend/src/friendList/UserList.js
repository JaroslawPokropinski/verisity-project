import React from 'react';
import PropTypes from 'prop-types';

import {
  List, ListItem, ListItemText, Avatar, ListItemAvatar,
  ListItemSecondaryAction, IconButton, makeStyles
} from '@material-ui/core';
import PhoneIcon from '@material-ui/icons/Phone';

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
function UsersList({ users, onFriendClick, onFriendCall }) {
  const classes = useStyles();
  if (users.length > 0) {
    return (
      <List className={classes.root}>
        {users.map((user) => (
          <ListItem
            className={classes.item}
            button
            key={user.email}
            onClick={() => onFriendClick(user.email)}
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
                  onFriendCall(user.email);
                }}
              >
                <PhoneIcon />
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
        <ListItemText primary="No results" />
      </ListItem>
    </List>
  );
}

UsersList.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string })).isRequired,
  onFriendClick: PropTypes.func.isRequired,
  onFriendCall: PropTypes.func.isRequired,
};

export default UsersList;

// name = { user.name }
// onFriendClick = {() => onFriendClick(user.email)}
// onFriendCall = {() => onFriendCall(user.email)}
