function UserInfo(login) {
  this.login = login;
}

class UserService {
  constructor(database) {
    this.database = database;
  }

  getUser(login, password) {
    return new Promise((resolve, reject) => {
      if (login === 'admin' && password === 'admin') {
        resolve(new UserInfo(login));
        return;
      }
      reject('Login or password are incorrect!');
    });
  }
}


module.exports = UserService;