const validate = (login, pass) => {
  if (login.length < 3) {
    return 'Login must have at least 3 signs';
  }

  if (pass.length < 5) {
    return 'Password must have at least 8 signs';
  }
  return false;
};

export default validate;
