import PropTypes from 'prop-types';
import Peer from 'peerjs';

class Store {
}

Store.shape = PropTypes.shape({
  isPeerOpen: PropTypes.bool,
  peer: PropTypes.instanceOf(Peer),
  peerId: PropTypes.string,
  isSessionPending: PropTypes.bool,
  isSessionOnline: PropTypes.bool,
  login: PropTypes.string
});

export default Store;
