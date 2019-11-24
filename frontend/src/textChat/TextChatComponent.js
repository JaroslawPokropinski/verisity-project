import React from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import MessageList from './MessageList';
import axios from '../axios';


class TextChatComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
        };
    }

    render() {
        const { messages } = this.state;
        return (
            <div className="TextChatComponent">
            <MessageList
                messages={messages}
            />
            <input
                class="TextChatInput"
                onKeyPress={this.sendMessage}
            />
            </div>
        )
    }

    componentDidMount() {
        axios
            .get('friends/admin@example.com')
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

        const message = e.target.value;
        e.target.value = "";

        axios
            .post('/friends/admin@example.com', message)
    }
};

export default TextChatComponent;
