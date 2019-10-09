import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import Peer from './peerjs';

import Login from './Login';
import Root from './Root';
import axios from './axios';

const Container = styled.div`
  height: 100vh;
  overflow: hidden;
`;

const updateStore = (update) => this.setState(update);

class App extends React.Component {
  constructor(props) {
    super(props);
    const storeInit = {
      isPeerOpen: false,
      peer: null,
      peerId: null,
      isSessionPending: true,
      isSessionOnline: false,
      login: null
    };

    this.state = storeInit;
  }

  componentDidMount() {
    // Connect peer
    const peer = new Peer();
    peer.on('open', (id) => {
      console.log(id);
      this.setState((prevState) => ({
        ...prevState, peer, isPeerOpen: true, peerId: id
      }));
    });

    // Check http session
    axios.post('/session/create');
    axios.post('/session/userinfo').then((response) => {
      const userInfo = response.data;
      if (userInfo !== '') {
        this.setState({
          isSessionPending: false,
          isSessionOnline: true,
          login: userInfo.login
        });
      } else {
        this.setState({ isSessionPending: false });
      }
    }).catch(() => {
      this.setState({ isSessionPending: false });
    });
  }

  render() {
    const { isPeerOpen, isSessionPending } = this.state;
    const Router = () => (
      <BrowserRouter>
        <Switch>
          <Route path="/login" exact render={(props) => <Login history={props.history} store={this.state} updateStore={updateStore} />} />
          <Route path="/" exact render={(props) => <Root history={props.history} store={this.state} updateStore={updateStore} />} />
        </Switch>
      </BrowserRouter>
    );

    return (
      <Container>
        {
          isPeerOpen && !isSessionPending
            ? <Router />
            : 'Loading'
        }
      </Container>
    );
  }
}

export default App;
