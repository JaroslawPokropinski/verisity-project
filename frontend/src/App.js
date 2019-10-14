import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';


import Login from './Login';
import Root from './Root';
import axios from './axios';
import Peer from './peerjs';
import { setPeer, setSession } from './actions/sessionActions';


const Container = styled.div`
  height: 100vh;
  overflow: hidden;
  padding: 0;
`;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPeerOpen: false,
      isSessionPending: false,
    };

    this.dismissToast = () => { };
    this.isloading = () => {
      const { isPeerOpen, isSessionPending } = this.state;
      return !isPeerOpen || isSessionPending;
    };
  }

  componentDidMount() {
    const { setPeer: psetPeer, setSession: psetSession } = this.props;
    // Connect peer
    const peer = new Peer();
    peer.on('open', (id) => {
      psetPeer(peer, id);
      this.setState((prevState) => ({
        ...prevState, isPeerOpen: true,
      }));
      if (!this.isloading()) {
        this.dismissToast();
      }
    });

    peer.on('error', (error) => {
      toast.error(`Peerjs: ${error.type}`);
    });

    // Check http session
    axios.post('/session/create');
    axios.post('/session/userinfo')
      .then((response) => {
        const userInfo = response.data;
        if (userInfo !== '') {
          psetSession(userInfo.login);
          this.setState({ isSessionPending: false });
        } else {
          this.setState({ isSessionPending: false });
        }
        if (!this.isloading()) {
          this.dismissToast();
        }
      })
      .catch(() => {
        this.setState({ isSessionPending: false });
        if (!this.isloading()) {
          this.dismissToast();
        }
      });

    const toastId = toast.info('Loading...', { autoClose: false, closeOnClick: false });
    this.dismissToast = () => setTimeout(() => toast.dismiss(toastId), 500);
  }

  render() {
    const Router = () => (
      <Switch>
        <Route path="/login" exact component={Login} />
        <Route path="/" exact component={Root} />
      </Switch>
    );

    return (
      <Container>
        <ToastContainer />
        <BrowserRouter basename="/app">
          {
            !this.isloading()
              ? <Router />
              : null
          }
        </BrowserRouter>
      </Container>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  setSession: (login) => {
    dispatch(setSession(login));
  },
  setPeer: (peer, peerId) => {
    dispatch(setPeer(peer, peerId));
  },
});

App.propTypes = {
  setSession: PropTypes.func.isRequired,
  setPeer: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(App);
