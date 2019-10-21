import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

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

const StyledText = styled.span`
  font-size: 0.8em;
`;

const StyledLink = styled(Link)`
  font-size: 0.8em;
`;

function Register() {
  return (
    <div>
      <StyledText>Are you new?</StyledText>
      <StyledLink to="/register">Register here</StyledLink>
    </div>
  );
}

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
    };

    autoBind(this);
  }

  componentDidMount() {
    toast('Email: admin@example.com, Pass: adminadmin', { autoClose: false });
  }

  onFormSubmit(event) {
    event.preventDefault();
    const { email, password } = this.state;
    const { history, setSession } = this.props;
    const valError = validate(email, password);
    if (valError) {
      toast.error(valError);
      return;
    }

    axios
      .post('/login', { email, password })
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

  onLoginChange(event) {
    this.setState({ email: event.target.value });
  }

  onPassChange(event) {
    this.setState({ password: event.target.value });
  }

  render() {
    const { email, password } = this.state;
    return (
      <Flex>
        <Container>
          <form onSubmit={this.onFormSubmit}>
            <Label htmlFor="email">
              Email:
              <TextInput type="text" id="email" onChange={this.onLoginChange} value={email} />
            </Label>
            <Label htmlFor="password">
              Password:
              <TextInput type="password" id="password" onChange={this.onPassChange} value={password} />
            </Label>
            <Submit type="submit" value="Submit" />
          </form>

          <Register />
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
