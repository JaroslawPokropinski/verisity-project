import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';


function ColorFromAuthor(author) {
  // TODO : implement some smarter mechanics to determine color of message
  const colors = [
    '#00818a',
    '#f7be16'
  ];

  return colors[author.length % colors.length];
}


function Message({ message }) {
  let color = ColorFromAuthor(message.author);
  let tooltip = `${message.author}: ${message.createdAt}`;
  return (
    <Tooltip title={tooltip}>
      <ListItem style={{ background: color }}>
        <ListItemText>{message.content}</ListItemText>
      </ListItem>
    </Tooltip>
  );
}


export default Message;
