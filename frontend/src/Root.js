import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';

import Chat from './Chat';

const RootContainer = styled.div`

`;

const getDevices = () => new Promise((resolve) => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    return resolve({ audio: false, video: false });
  }

  navigator.mediaDevices.enumerateDevices().then((devices) => {
    const reducer = (accumulator, device) => {
      if (device.kind === 'audioinput') {
        accumulator.audio = true;
      }

      if (device.kind === 'videoinput') {
        accumulator.video = true;
      }
      return accumulator;
    };
    resolve(devices.reduce(reducer, { audio: false, video: false }));
  });
  return null;
});

class Root extends React.Component {
  constructor() {
    super();
    this.state = { /* friends: null */ input: '' };
    this.mediastream = null;
    this.videoRef = null;
    this.devices = { audio: false, video: false };
    autoBind(this);
  }

  componentDidMount() {
    const { session, history } = this.props;

    if (!session.isSessionOnline) {
      // TODO: prompt error
      history.push('/login');
      return;
    }
    getDevices().then((devices) => { this.devices = devices; });

    const { peer } = session;
    peer.on('call', (call) => {
      call.on('error', (err) => {
        alert(`Call error: ${err}`);
      });
      // Answer the call, providing our mediaStream
      if (navigator.mediaDevices
        && navigator.mediaDevices.getUserMedia
        && navigator.mediaDevices.enumerateDevices) {
        navigator.mediaDevices
          .getUserMedia({ audio: this.devices.audio, video: this.devices.video })
          .then((stream) => {
            call.answer(stream);
            call.on('stream', (incoming) => {
              // provide stream to video element
              if (this.videoRef.current !== null) {
                this.videoRef.current.srcObject = incoming;
                this.videoRef.current.play();
              }
            });
          })
          .catch((error) => {
            alert(`Failed to get video with error: ${error}`);
          });
      } else {
        // Inform user about error (no camera)
        call.close();
      }
    });
  }

  onCall(id) {
    // on button 'call friend' pressed
    // call server for 'to' id
    const { session } = this.props;
    const { peer } = session;
    if (navigator.mediaDevices
      && navigator.mediaDevices.getUserMedia
      && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.getUserMedia({ audio: this.devices.audio, video: this.devices.video })
        .then((stream) => {
          const call = peer.call(id, stream);
          call.on('stream', (incoming) => {
            // provide stream to video element
            if (this.videoRef.current !== null) {
              this.videoRef.current.srcObject = incoming;
              this.videoRef.current.play();
            }
          });
        })
        .catch((error) => {
          alert(`Failed to get video with error: ${error}`);
        });
    } else {
      // Inform user about error (no camera)
    }
  }

  onVideo(ref) {
    this.videoRef = ref;
  }

  onInput(e) {
    this.setState({ input: e.target.value });
  }

  onClick() {
    const { input } = this.state;
    this.onCall(input);
  }

  render() {
    const { input } = this.state;
    const { session } = this.props;
    const { peerId } = session;

    return (
      <RootContainer>
        {peerId}
        <input type="text" onChange={this.onInput} value={input} />
        <input type="submit" value="Connect" onClick={this.onClick} />
        <Chat onVideo={this.onVideo} />
      </RootContainer>
    );
  }
}

Root.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
  session: PropTypes.instanceOf(Object).isRequired,
};

const mapStateToProps = (state) => ({
  session: state.session
});

const containerRoot = connect(mapStateToProps)(Root);

export default containerRoot;
