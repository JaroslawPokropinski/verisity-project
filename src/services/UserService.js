const { genSalt, hash, compare } = require('bcryptjs');
const log = require('debug')('user');
// function UserInfo(login) {
//   this.login = login;
// }

class UserService {
  /**
   * @typedef {import('sequelize').Model} Model
   */

  /**
   * @param {Model} UserModel 
   */
  constructor(UserModel) {
    this.UserModel = UserModel;
    log(JSON.stringify(UserModel));
  }

  cryptPassword(password) {
    return new Promise((resolve, reject) => {
      genSalt(10, function (err, salt) {
        if (err) {
          reject('Failed to generate salt!');
          return;
        }
        hash(password, salt, function (err, _hash) {
          if (err) {
            reject('Failed to hash password!');
            return;
          }
          resolve(_hash);
        });
      });
    })
  }

  getUser(login, password) {
    return new Promise((resolve, reject) => {
      let user = null;
      this.UserModel.findOne({ where: { login } })
        .then((_user) => {
          if (_user === null) {
            reject('Login or password are incorrect!');
          }
          user = _user;
          return compare(password, user.hash_password);
        })
        .then((isCorrect) => {
          if (!isCorrect) {
            reject('Login or password are incorrect!');
          }
          resolve(user);
        })
        .catch((error) => {
          log('Database error!', error.message);
          reject('Database error!');
        });
    });
  }

  addUser(login, password) {
    return new Promise((resolve, reject) => {
      this.cryptPassword(password)
        .then((hash_password) => this.UserModel.create({ login, hash_password }))
        .then((user) => resolve(user))
        .catch((error) => reject(error));
    });
  }
}


module.exports = UserService;