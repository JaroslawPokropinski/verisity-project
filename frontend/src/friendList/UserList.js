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
              key={user.id} 
              name={user.name} 
              onFriendClick={onFriendClick}
              onFriendCall={onFriendCall}
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
    // users: PropTypes.list.isRequired,
};
  
export default UsersList;
