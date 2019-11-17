import React from 'react';
import PropTypes from 'prop-types';

import Message from './Message';


//create list of already sent messages between friends
function MessageList({ friends }) {
    return (
        <div>
            {friends.getMessages().map((message) => (
                <Message
                    text={message.content}
                />
            ))}
        </div>
    );
};


MesssageList.PropTypes = {
    friends: PropTypes.arrayOf(PropTypes.shape({ content: PropTypes.string })).isRequired,
}

export default MessageList;
