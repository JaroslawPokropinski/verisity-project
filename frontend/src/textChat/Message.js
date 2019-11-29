import React from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';


// single message in text-chat
function Message({ message}) {
    return (
        <ListItem>
            <ListItemText>{message.content}-{message.createdAt}</ListItemText>
        </ListItem>
    );
};

Message.PropTypes = {
    text: PropTypes.string.isRequired,
};

export default Message;
