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

class Register extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      username: '',
      password: '',
      repeatedPassword: '',

    };

    autoBind(this);
  }

  onFormSubmit(event) {
    event.preventDefault();
    const {
      email, username, password, repeatedPassword
    } = this.state;
    const { history, setSession } = this.props;
    const valError = validate(email, password, repeatedPassword, username);
    if (valError) {
      toast.error(valError);
      return;
    }

    axios
      .post('/register', { email, name: username, password })
      .then(() => {
        setSession(email);
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

  onUsernameChange(event) {
    this.setState({ username: event.target.value });
  }

  onPassChange(event) {
    this.setState({ password: event.target.value });
  }

  onPassRepChange(event) {
    this.setState({ repeatedPassword: event.target.value });
  }

  onEmailChange(event) {
    this.setState({ email: event.target.value });
  }

  render() {
    const {
      email, username, password, repeatedPassword
    } = this.state;
    return (
      <Flex>
        <Container>
          <form onSubmit={this.onFormSubmit}>
            <Label htmlFor="email">
              Email:
              <TextInput type="text" id="email" onChange={this.onEmailChange} value={email} />
            </Label>

            <Label htmlFor="username">
              Username:
              <TextInput type="text" id="username" onChange={this.onUsernameChange} value={username} />
            </Label>

            <Label htmlFor="password">
              Password:
              <TextInput type="password" id="password" onChange={this.onPassChange} value={password} />
            </Label>

            <Label htmlFor="rep-password">
              Repeat password:
              <TextInput type="password" id="rep-password" onChange={this.onPassRepChange} value={repeatedPassword} />
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

Register.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
  setSession: PropTypes.func.isRequired,
};
const containerRegister = connect(
  null,
  mapDispatchToProps,
)(Register);

export default containerRegister;
