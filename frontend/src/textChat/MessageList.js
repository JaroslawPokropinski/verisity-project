import React from 'react';
import PropTypes from 'prop-types';

import Message from './Message';


//create list of messages
function MessageList({ messages }) {
    return (
        <div>
            {messages.map((message) => (
                <Message
                    text={message.content}
                />
            ))}
        </div>
    );
};


MessageList.PropTypes = {
    messages: PropTypes.arrayOf(PropTypes.shape({ content: PropTypes.string })).isRequired,
}

export default MessageList;
