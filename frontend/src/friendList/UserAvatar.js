import React from 'react';
import PropTypes from 'prop-types';

import Image from './Image';

// user avatar
function UserAvatar({ className, src, onFriendClick }) {
    return (
      <button 
        onClick={onFriendClick.bind(null)}
        type="button"
      >
        <Image
          src={src} 
          className={className}
          alt="" 
        />
      </button>
      
    );
  }
  
  UserAvatar.propTypes = {
    className: PropTypes.string.isRequired,
    src: PropTypes.string.isRequired,
  };

  export default UserAvatar;
