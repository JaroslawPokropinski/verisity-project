import React from 'react';
import PropTypes from 'prop-types';

import User from './User';


// create dynamic user list for all filtered users
function UsersList({ users, onFriendClick, onFriendCall }) {
  if (users.length > 0) {
    return (
      <div>
        {users.map((user) => (
          <User
            key={user.email}
            name={user.name}
            onFriendClick={() => onFriendClick(user.email)}
            onFriendCall={() => onFriendCall(user.email)}
          />
        ))}
      </div>
    );
  }

  return (
    <p>No results</p>
  );
}

UsersList.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string })).isRequired,
  onFriendClick: PropTypes.func.isRequired,
  onFriendCall: PropTypes.func.isRequired,
};

export default UsersList;
