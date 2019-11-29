import React from 'react';
import PropTypes from 'prop-types';

import Message from './Message';
import List from '@material-ui/core/List';

//create list of messages
function MessageList({ messages }) {
    var tmp = false;
    messages.forEach(element => {
        tmp = true;
        console.log('dupa.8');
    });
    if (!tmp) { return ''; }
    return (
        <div class="MessageList">
            <List>
                {messages.pop().map((message) => (
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
