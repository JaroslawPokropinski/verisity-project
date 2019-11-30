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
            messages: [],
            previous_friend: ''
        };
    }

    render() {
        const { messages, get_friend, previous_friend } = this.state;

        if (get_friend() != previous_friend) { this.getMessages(); }

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

    getMessages() {
        const { get_friend } = this.state;
        const friend = get_friend()

        axios
            .get('friends/' + friend)
            .then((response) => {
                this.setState({
                    messages: response.data.sort(function(a, b) { return a.createdAt > b.createdAt; }),
                    previous_friend: friend
                });
            })
            .catch((err) => {
                toast.error(`Failed to get messages list!`);
            });
    }

    sendMessage(e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode != '13') { return; }

        const { get_friend } = this.state;
        const message = e.target.value;
        e.target.value = "";

        axios
            .post('/friends/' + get_friend(), {message: message})
            .then(() => {
                this.getMessages();
            })
            .catch((err) => {
                toast.error(`Failed to send message.`);
            });
    }
};

export default TextChatComponent;
