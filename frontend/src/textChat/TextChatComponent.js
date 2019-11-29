import React from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import MessageList from './MessageList';
import axios from '../axios';
import TextField from '@material-ui/core/TextField';


class TextChatComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            get_friend: props.get_friend,
        };
    }

    render() {
        console.log('render');
        var { get_friend } = this.state;
        var messages = this.getMessages(get_friend());
        return (
            <div className="TextChatComponent">
            <MessageList
                messages={messages}
            />
            <TextField
                class="TextChatInput"
                onKeyPress={this.sendMessage.bind(this)}
            />
            </div>
        )
    }

    getMessages(friend) {
        var messages = [];
        axios
        .get('friends/' + friend)
        .then((response) => {
            messages.push(response.data.sort(function(a, b) { return a.createdAt > b.createdAt; }));
        })
        .catch((err) => {
            if (err.response) {
            toast.error(`Failed to get messages list! ${err.response.data}`);
            } else {
            toast.error(`Failed to get messages list! ${err}`);
            }
        });
        return messages;
    }

    sendMessage(e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode != '13') { return; }

        const { get_friend } = this.state;
        const message = e.target.value;
        e.target.value = "";
        const friend = get_friend();

        axios.post('/friends/' + friend, {message: message});
        this.forceUpdate();
    }
};

export default TextChatComponent;
