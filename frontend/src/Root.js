import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

import Content from './Content';
import Media from './helpers/media';

const RootContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const ConnectContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
const FriendList = styled.div``;

class Root extends React.Component {
  constructor() {
    super();
    this.state = { /* friends: null */ input: '', call: null };
    this.mediastream = null;
    this.videoRef = null;
    this.devices = { audio: false, video: false };
    autoBind(this);
  }

  componentDidMount() {
    const { session, history } = this.props;

    if (!session.isSessionOnline) {
      history.push('/login');
      return;
    }
    Media.getDevices()
      .then((devices) => {
        this.devices = devices;
        if (!this.devices.audio) {
          toast.warn('We couldn\'t detect microphone');
        }

        if (!this.devices.video) {
          toast.warn('We couldn\'t detect camera');
        }
      })
      .catch((error) => {
        toast.error(error);
      });

    const { peer } = session;
    peer.on('call', (call) => {
      call.on('error', (err) => {
        toast.error(`Call error: ${err}`);
      });

      Media.getMedia(this.devices)
        .then((stream) => {
          call.answer(stream);
          call.on('stream', (incoming) => {
            // provide stream to video element
            if (this.videoRef && this.videoRef.current) {
              this.videoRef.current.srcObject = incoming;
              this.videoRef.current.play();
            }
          });
          console.log(call);
          this.setState({ call: { peer: call.peer } });
        })
        .catch((error) => {
          toast.error(`Failed to get video with error: ${error}`);
        });
    });
  }

  // on button 'call friend' pressed
  onCall(id) {
    // call server for 'to' id
    const { session } = this.props;
    const { peer } = session;
    Media.getMedia(this.devices)
      .then((stream) => {
        const call = peer.call(id, stream);
        call.on('stream', (incoming) => {
          // provide stream to video element
          if (this.videoRef && this.videoRef.current) {
            this.videoRef.current.srcObject = incoming;
            this.videoRef.current.play();
          }
        });
        this.setState({ call: { peer: call.peer } });
      })
      .catch((error) => {
        toast.error(`Failed to get video with error: ${error}`);
      });
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
    const { input, call } = this.state;
    const { session } = this.props;
    const { peerId } = session;

    return (
      <RootContainer>
        <ConnectContainer>
          {peerId}
          <input type="text" onChange={this.onInput} value={input} />
          <input type="submit" value="Connect" onClick={this.onClick} />
        </ConnectContainer>

        <FriendList />
        <Content selected={call} onCall={call} onVideo={this.onVideo} />
        {/* <Chat onVideo={this.onVideo} /> */}
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
