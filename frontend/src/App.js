import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


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
  }

  componentDidMount() {
    const { setPeer: psetPeer, setSession: psetSession } = this.props;
    // Connect peer
    const peer = new Peer();
    peer.on('open', (id) => {
      console.log(id);
      psetPeer(peer, id);
      this.setState((prevState) => ({
        ...prevState, isPeerOpen: true,
      }));
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
      })
      .catch(() => {
        this.setState({ isSessionPending: false });
      });
  }

  render() {
    const { isPeerOpen, isSessionPending } = this.state;
    const Router = () => (
      <Switch>
        <Route path="/login" exact component={Login} />
        <Route path="/" exact component={Root} />
      </Switch>
    );

    return (
      <Container>
        <BrowserRouter>
          {
            isPeerOpen && !isSessionPending
              ? <Router />
              : 'Loading'
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
