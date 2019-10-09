import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const ChatContainer = styled.div`

`;

class Chat extends React.Component {
  constructor() {
    super();
    this.videoRef = React.createRef();
  }

  componentDidMount() {
    const { onVideo } = this.props;
    onVideo(this.videoRef);
  }

  render() {
    return (
      <ChatContainer>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video ref={this.videoRef} />
      </ChatContainer>
    );
  }
}

Chat.propTypes = {
  onVideo: PropTypes.func.isRequired,
};

export default Chat;
