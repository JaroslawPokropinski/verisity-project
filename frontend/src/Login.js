import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

import validate from './credValidator';
import axios from './axios';
import { setSession as ss } from './actions/sessionActions';

const Flex = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 56px;
`;

const Container = styled.div`
  padding: 40px;
  border-radius: 4px;
  background-color: white;
`;

const Label = styled.label`
  display: block;
`;

const TextInput = styled.input`
  display: inline-block;
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
`;

const Submit = styled.input`
  width: 100%;
  background-color: var(--primary-color);
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      login: '',
      password: '',
    };

    autoBind(this);
  }

  componentDidMount() {
    toast('Login: admin, Pass: admin', { autoClose: false });
  }

  onFormSubmit(event) {
    event.preventDefault();
    const { login, password } = this.state;
    const { history, setSession } = this.props;
    const valError = validate(login, password);
    if (valError) {
      toast.error(valError);
      return;
    }

    axios
      .post('/login', { login, password })
      .then(() => {
        setSession(login);
        history.push('/');
      })
      .catch((err) => {
        if (err.response) {
          toast.error(`Failed to submit form! ${err.response.data}`);
        } else {
          toast.error(`Failed to submit form! ${err}`);
        }
      });
  }

  onLoginChange(event) {
    this.setState({ login: event.target.value });
  }

  onPassChange(event) {
    this.setState({ password: event.target.value });
  }

  render() {
    const { login, password } = this.state;
    return (
      <Flex>
        <Container>
          <form onSubmit={this.onFormSubmit}>
            <Label htmlFor="login">
              Login:
              <TextInput type="text" id="login" onChange={this.onLoginChange} value={login} />
            </Label>
            <Label htmlFor="password">
              Password:
              <TextInput type="password" id="password" onChange={this.onPassChange} value={password} />
            </Label>
            <Submit type="submit" value="Submit" />
          </form>
        </Container>
      </Flex>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  setSession: (login) => {
    dispatch(ss(login));
  }
});

Login.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
  setSession: PropTypes.func.isRequired,
};
const containerLogin = connect(
  null,
  mapDispatchToProps,
)(Login);

export default containerLogin;
