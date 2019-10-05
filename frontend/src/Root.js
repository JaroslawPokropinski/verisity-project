import React from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';

import Store from './Store';

class Root extends React.Component {
  constructor() {
    super();
    this.state = { /* friends: null */ };
    this.mediastream = null;
    autoBind(this);
  }

  componentDidMount() {
    const { store, history } = this.props;
    if (!store.isSessionOnline) {
      history.push('/login');
    }

    const { peer } = store;
    peer.on('call', (call) => {
      // Answer the call, providing our mediaStream
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
          call.answer(stream);
        });
      } else {
        // Inform user about error (no camera)
        call.close();
      }
    });
  }

  onCall() {
    // on button 'call friend' pressed
    // call server for 'to' id
    const id = '';
    const { store } = this.props;
    const { peer } = store;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        const call = peer.call(id, stream);
        call.on('stream', (stream) => {
          // provide stream to canvas
          // TODO
        });
      });
    } else {
      // Inform user about error (no camera)
    }
  }

  render() {
    return <div />;
  }
}

Root.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
  store: Store.shape.isRequired,

};

export default Root;
