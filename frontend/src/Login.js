import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Flex = styled.div`
  display: flex;
  justify-content: center;
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

const onFormSubmit = (ev, history) => {
  ev.preventDefault();
  // TODO: validate input
  // TODO: save session to store
  // TODO: redirect to chat
  history.push();
};

const Login = (props) => (
  <Flex>
    <Container>
      <form onSubmit={(ev) => onFormSubmit(ev, props.history)}>
        <Label htmlFor="login">
          Login:
          <TextInput type="text" id="login" />
        </Label>
        <Label htmlFor="password">
          Password:
          <TextInput type="password" id="password" />
        </Label>
        <Submit type="submit" value="Submit" />
      </form>
    </Container>
  </Flex>
);

Login.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
};

export default Login;
