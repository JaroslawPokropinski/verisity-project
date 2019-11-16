import React from 'react';
import PropTypes from 'prop-types';

import UsersList from './UserList';


class FriendsComponent extends React.Component {
    constructor({ allUsers, onFriendClick, onFriendCall }) {
      super(allUsers, onFriendClick, onFriendCall);
      this.state = {
        allUsers,
        filteredUsers: allUsers
      };
  
      this.filter = this.filter.bind(this);
    }

    componentDidMount() {
      fetch('http://localhost:9000/api/friends')
        .then((res) => res.json())
        .then((response) => this.setState({ 
          allUsers: response.users,
          filteredUsers: response.users
        }));
    }
  
    getFilteredUsers(text) {
      return this.state.allUsers.filter(
        (user) => user.name.toLowerCase().includes(text.toLowerCase())
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
        <div className="FriendListComponent">
          <input 
            className="findUsersInput"
            onChange={this.filter}
          />
          <UsersList 
            users={this.state.filteredUsers} 
            onFriendClick={this.props.onFriendClick} 
            onFriendCall={this.props.onFriendCall}
          />
        </div>
      );
    }
  }

  
FriendsComponent.propTypes = {
    // name: PropTypes.string.isRequired,
};
  
export default FriendsComponent;
