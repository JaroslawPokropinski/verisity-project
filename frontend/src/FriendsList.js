import React from 'react';
import PropTypes from 'prop-types';

const userStyles = {
  display: 'inline-block'
};

const allUsers = ['Jarosław', 'Piotr', 'Wojciech', 'Mateusz'];


function FriendListComponent() {
  return (
    <div className="FriendListComponent">
      <FriendsComponent allUsersList={allUsers} />
    </div>
  );
}


class FriendsComponent extends React.Component {
  constructor({ allUsersList }) {
    super();
    this.state = {
      filteredUsers: allUsersList
    };

    this.filter = this.filter.bind(this);
  }

  getFilteredUsers(text) {
    return this.props.allUsersList.filter(
      (user) => user.toLowerCase().includes(text.toLowerCase())
    );
  }

  filter(e) {
    const text = e.currentTarget.value;
    const newUsers = this.getFilteredUsers(text);
    this.setState({
      filteredUsers: newUsers
    });
  }

  render() {
    return (
      <div>
        <input 
          className="findUsersInput"
          onChange={this.filter}
        />
        <UsersList users={this.state.filteredUsers} />
      </div>
    );
  }
}


// create dynamic user list for all filtered users
function UsersList({ users }) {
  if (users.length > 0) {
    return (
      <div>
        {users.map((user) => <User key={user} name={user} />)}
      </div>
    );
  }

  return (
    <p>No results</p>
  );  
}

const clickAlert = () => alert('Kliknięto!');


// single user row
function User({ name }) {
  const avatarUrl = `https://api.adorable.io/avatars/55/${name}.png`;
  return (
    <div className="user">
      <Image 
        style={userStyles} 
        className="user_avatar"
        src={avatarUrl}
      />
      <p style={userStyles}>{name}</p>
      <button 
        onClick={clickAlert}
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

// user avatar
function Image({ className, src }) {
  return (
    <img
      src={src} 
      className={className}
      alt="" 
    />
  );
}

Image.propTypes = {
  className: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
};

export default FriendListComponent;
