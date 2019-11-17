/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Container = styled.div``;

const Video = styled.video`
  background-color: white;
  min-width: 400px;
  min-height: 400px; 
`;

export default class VideoChat extends React.Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
  }

  componentDidMount() {
    const { onVideo } = this.props;
    onVideo(this.videoRef);
  }

  render() {
    const { onCall } = this.props;
    if (onCall === null) {
      return null;
    }
    return (
      <Container>
        <Video ref={this.videoRef} />
      </Container>
    );
  }
}

VideoChat.propTypes = {
  onCall: PropTypes.instanceOf(Object),
  onVideo: PropTypes.func.isRequired,
};

VideoChat.defaultProps = {
  onCall: null,
};
