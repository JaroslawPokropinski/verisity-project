import React from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';


// single message in text-chat
function Message({ message}) {
    console.log(message);
    return (
        <ListItem style="border: solid;">
            <ListItemText>{message.content}-{message.createdAt}</ListItemText>
        </ListItem>
    );
};

Message.PropTypes = {
    text: PropTypes.string.isRequired,
};

export default Message;
