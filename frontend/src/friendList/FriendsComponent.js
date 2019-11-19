import React from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { TextField } from '@material-ui/core';
import axios from '../axios';

import UsersList from './UserList';
import AddFriendComponent from './AddFriendComponent';

class FriendsComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allUsers: [],
      filteredUsers: [],
    };

    this.filter = this.filter.bind(this);
  }

  componentDidMount() {
    axios
      .get('/friends')
      .then((response) => {
        this.setState({
          allUsers: response.data,
          filteredUsers: response.data
        });
      })
      .catch((err) => {
        if (err.response) {
          toast.error(`Failed to get friends list! ${err.response.data}`);
        } else {
          toast.error(`Failed to get friends list! ${err}`);
        }
      });
  }

  getFilteredUsers(text) {
    const { allUsers } = this.state;
    return allUsers.filter(
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
    const { filteredUsers } = this.state;
    const { onFriendClick, onFriendCall } = this.props;
    return (
      <div className="FriendListComponent">
        <AddFriendComponent />
        <TextField
          onChange={this.filter}
        />
        <UsersList
          users={filteredUsers}
          onFriendClick={onFriendClick}
          onFriendCall={onFriendCall}
        />
      </div>
    );
  }
}


FriendsComponent.propTypes = {
  onFriendClick: PropTypes.func.isRequired,
  onFriendCall: PropTypes.func.isRequired,
};

export default FriendsComponent;
