import React from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import axios from '../axios';

import InvitationList from './InvitationsList';

class InvitationComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        pending: [],
    };
  }

  componentDidMount() {
    axios
      .get('/friends/invitations')
      .then((response) => {
        this.setState({
          pending: response.data
        });
      })
      .catch((err) => {
        if (err.response) {
          toast.error(`Failed to get invitations list! ${err.response.data}`);
        } else {
          toast.error(`Failed to get invitations list! ${err}`);
        }
      });
  }

  render() {
    const { pending } = this.state;
    const { acceptFriend } = this.props;
    return (
      <InvitationList
        pending={pending}
        acceptFriend={acceptFriend}
      />
    );
  }
}

export default InvitationComponent;
