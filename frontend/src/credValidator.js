const validate = (email, pass, repPass, name) => {
  if (email.length < 3) {
    return 'Email must have at least 3 signs';
  }

  if (name && name.length < 3) {
    return 'Username must have at least 3 signs';
  }

  if (pass.length < 8) {
    return 'Password must have at least 8 signs';
  }

  if (repPass && repPass !== pass) {
    return 'Passwords must be identical';
  }

  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g;
  if (!re.test(email)) {
    return 'Email must be valid';
  }
  return false;
};

export default validate;
