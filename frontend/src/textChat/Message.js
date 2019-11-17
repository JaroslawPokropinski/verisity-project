import React from 'react';
import PropTypes from 'prop-types';


const messageStyle = {
    display: 'inline-block'
};


// single message in text-chat
function Message({ text }) {
    return (
        <div className="message" style={messageStyle}>
            {text}
        </div>
    );
};


Message.PropTypes = {
    text: PropTypes.string.isRequired,
};

export default Message;
