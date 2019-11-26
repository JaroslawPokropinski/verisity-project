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
            messages: [],
            get_friend: props.get_friend
        };
    }

    render() {
        var { messages } = this.state;
        messages = messages.sort(function(a, b) { return a.createdAt > b.createdAt; });
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

    componentDidMount() {
        const { get_friend } = this.state;
        this.getMessages(get_friend())
    }

    getMessages(friend) {
        axios
        .get('friends/' + friend)
        .then((response) => {
            this.setState({
                messages: response.data
            });
        })
        .catch((err) => {
            if (err.response) {
            toast.error(`Failed to get messages list! ${err.response.data}`);
            } else {
            toast.error(`Failed to get messages list! ${err}`);
            }
        });
    }

    sendMessage(e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode != '13') { return; }
        const { get_friend } = this.state;
        const message = e.target.value;
        e.target.value = "";
        const friend = get_friend();
        axios
            .post('/friends/' + friend, {message: message});
        this.getMessages(friend);
    }
};

export default TextChatComponent;
