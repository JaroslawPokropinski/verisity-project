import React from 'react';
import PropTypes from 'prop-types';

import MessageList from './MessageList';


class TextChatComponent extends React.Component {

    render() {
        const msg1 = {
            'content': 'message 1'
        };
        const msg2 = {
            'content': 'fdssfads'
        }
        const msg3 = {
            'content': 'fkajhfkjdsafdsa'
        }
        const msgs = [msg1, msg2, msg3]
        return (
            <div className="TextChatComponent">
            <p>TEXTCHAT</p>
            <MessageList
                messages={msgs}
            />
            <input class="TextChatInput"/>
            </div>
        )
    }
};

export default TextChatComponent;
