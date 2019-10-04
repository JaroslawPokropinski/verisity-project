import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  height: 100vh;
  overflow: hidden;
`;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Container>
        <Router>
          <Switch>
            <Route path="/" exact render={() => null} />
          </Switch>
        </Router>
      </Container>
    );
  }
}

export default App;
