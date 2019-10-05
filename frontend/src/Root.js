import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';

import Store from './Store';
import Chat from './Chat';

const RootContainer = styled.div`

`;

class Root extends React.Component {
  constructor() {
    super();
    this.state = { /* friends: null */ input: '' };
    this.mediastream = null;
    this.videoRef = null;
    autoBind(this);
  }

  componentDidMount() {
    const { store, history } = this.props;
    // if (!store.isSessionOnline) {
    //   history.push('/login');
    // }

    const { peer } = store;
    peer.on('call', (call) => {
      // Answer the call, providing our mediaStream
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then((stream) => {
          call.answer(stream);
          call.on('stream', (incoming) => {
            // provide stream to video element
            if (this.videoRef.current !== null) {
              this.videoRef.current.srcObject = incoming;
              this.videoRef.current.play();
            }
          });
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
    const { store } = this.props;
    const { peer } = store;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then((stream) => {
        const call = peer.call(id, stream);
        call.on('stream', (incoming) => {
          // provide stream to video element
          if (this.videoRef.current !== null) {
            this.videoRef.current.srcObject = incoming;
            this.videoRef.current.play();
          }
        });
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
    return (
      <RootContainer>
        <input type="text" onChange={this.onInput} value={input} />
        <input type="submit" value="Connect" onClick={this.onClick} />
        <Chat onVideo={this.onVideo} />
      </RootContainer>
    );
  }
}

Root.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
  store: Store.shape.isRequired,

};

export default Root;
