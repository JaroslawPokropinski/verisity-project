import React from 'react';
import PropTypes from 'prop-types';

import UserAvatar from './UserAvatar';
import Image from './Image';

const userStyles = {
    display: 'inline-block'
};

// single user row
function User({ name, onFriendClick, onFriendCall }) {
    const avatarUrl = `https://api.adorable.io/avatars/55/${name}.png`;
    return (
      <div className="user">
        <UserAvatar 
          style={userStyles} 
          className="user_avatar"
          src={avatarUrl}
          onFriendClick={onFriendClick}
        />
        <p style={userStyles}>{name}</p>
        <button 
          onClick={onFriendCall.bind(null)}
          type="button"
        >
          <Image
            style={userStyles}
            className="phone_icon"
            src={require('./resources/image/phone_image.png')}
            
          />
        </button>
      </div>
    );
}

User.propTypes = {
    name: PropTypes.string.isRequired,
};
  
export default User;
