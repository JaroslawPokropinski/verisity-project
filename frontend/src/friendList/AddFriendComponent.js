import React from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import axios from '../axios';

class AddFriendComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        username: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.addFriend = this.addFriend.bind(this);
  }

    handleChange(e) {
        this.setState({
            username: e.target.value,
        });
    }

  addFriend() {
    const { username } = this.state;

    axios
    .post('/friends', { email: username})
    .then(() => {
      toast.success(`Invitation for ${username} was sent!`);
    })
    .catch((err) => {
      if (err.response) {
        toast.error(`Failed to add friends ${username}! ${err.response.data}`);
      } else {
        toast.error(`Failed to add friends ${username}! ${err}`);
      }
    });
  }

  render() {
    return (
      <div className="FriendListComponent">
        <input
          className="addUsersInput"
          placeholder="Find user to add"
          onChange={this.handleChange}
        />
        <button
          type="button"
          onClick={this.addFriend}
        >
          ADD
        </button>
      </div>
    );
  }
}


// AddFriendComponent.propTypes = {
//   onFriendClick: PropTypes.func.isRequired,
//   onFriendCall: PropTypes.func.isRequired,
// };

export default AddFriendComponent;
