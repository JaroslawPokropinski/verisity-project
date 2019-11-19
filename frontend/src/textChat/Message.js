import React from 'react';
import PropTypes from 'prop-types';

// single message in text-chat
function Message({ text }) {
    return (
        <div className="Message">
            {text}
        </div>
    );
};

Message.PropTypes = {
    text: PropTypes.string.isRequired,
};

export default Message;
