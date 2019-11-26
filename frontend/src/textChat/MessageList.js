import React from 'react';
import PropTypes from 'prop-types';

import Message from './Message';
import List from '@material-ui/core/List';

//create list of messages
function MessageList({ messages }) {
    return (
        <div class="MessageList">
            <List>
                {messages.map((message) => (
                    <Message
                        message={message}
                    />
                ))}
            </List>
        </div>
    );
};

MessageList.PropTypes = {
    messages: PropTypes.arrayOf(PropTypes.shape({ content: PropTypes.string })).isRequired,
}

export default MessageList;
