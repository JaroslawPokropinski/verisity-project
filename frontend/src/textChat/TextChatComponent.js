import React from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import TextField from '@material-ui/core/TextField';
import autoBind from 'react-autobind';
import MessageList from './MessageList';
import axios from '../axios';

const compareByString = (a, b) => {
  if (a.updatedAt < b.updatedAt) {
    return -1;
  }

  if (a.updatedAt > b.updatedAt) {
    return 1;
  }
  return 0;
};


class TextChatComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      get_friend: props.get_friend,
      messages: [],
      previous_friend: ''
    };
    autoBind(this);
  }

  getMessages() {
    const { get_friend } = this.state;
    const friend = get_friend;
    console.log(friend);

    axios
      .get(`friends/${friend}`)
      .then((response) => {
        this.setState({
          messages: response.data.sort(compareByString),
          previous_friend: friend
        });
      })
      .catch((err) => {
        toast.error('Failed to get messages list!');
      });
  }

  sendMessage(e) {
    const keyCode = e.keyCode || e.which;
    if (keyCode != '13') { return; }

    const { get_friend } = this.state;
    const message = e.target.value;
    e.target.value = '';


    axios
      .post(`/friends/${get_friend}`, { message })
      .then(() => {
        this.getMessages();
      })
      .catch((err) => {
        toast.error('Failed to send message.');
      });
  }

  render() {
    const { messages, get_friend, previous_friend } = this.state;

    if (get_friend != previous_friend) { this.getMessages(); }

    return (
      <div className="TextChatComponent">
        <MessageList
          messages={messages}
        />
        <TextField
          className="TextChatInput"
          onKeyPress={this.sendMessage.bind(this)}
        />
      </div>
    );
  }
}

export default TextChatComponent;
