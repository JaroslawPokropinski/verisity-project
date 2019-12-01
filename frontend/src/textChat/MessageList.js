import React from 'react';
import PropTypes from 'prop-types';

import List from '@material-ui/core/List';

import Message from './Message';


function MessageList({ messages }) {
  return (
    <div className="MessageList">
      <List>
        {messages.map((message) => (
          <Message
            key={message.id}
            message={message}
          />
        ))}
      </List>
    </div>
  );
}

MessageList.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape({ content: PropTypes.string })).isRequired,
};

export default MessageList;
