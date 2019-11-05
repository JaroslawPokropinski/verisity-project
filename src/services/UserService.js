const { genSalt, hash, compare } = require('bcryptjs');
const log = require('debug')('user');
const { Sequelize } = require('sequelize');
const Op = Sequelize.Op;
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
  constructor(UserModel, FriendsModel) {
    this.UserModel = UserModel;
    this.FriendsModel = FriendsModel;
    log(JSON.stringify(UserModel));
    log(JSON.stringify(FriendsModel));
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

  getUser(email, password) {
    return new Promise((resolve, reject) => {
      let user = null;
      this.UserModel.findOne({ where: { email } })
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

  addUser(email, name, password) {
    return new Promise((resolve, reject) => {
      this.cryptPassword(password)
        .then((hash_password) => this.UserModel.create({ email, name, hash_password }))
        .then((user) => resolve(user))
        .catch((error) => reject(error));
    });
  }

  //FriendsRelation function
  _getUserId(userName) {
    return new Promise((resolve, reject) => {
      this.UserModel.findOne({where: {name: userName}})
        .then((user) => {
          if(user === null) {
            reject('There is no such user as ' + userName + '!');
          } else {
            resolve(user.id);
          }
        })
        .catch((error) => {
          log('Database error!', error.message);
          reject('Database error!');
        })
    });
  }

  getFriendsList(userName) {
    return new Promise((resolve, reject) => {
      this.UserModel.findOne({where: {name: userName}})
        .then((user) => user.getFriend({where: {}, through: {isAccepted: true}, attributes: ['name', 'email'], includeIgnoreAttributes: false}))
        .then((friendsList) => resolve(friendsList))
        .catch((error) => {
          log('Database error!', error.message);
          reject('Database error!');
        });
    });
  }

  getPendingInvitations(userName) {
    return new Promise((resolve, reject) => {
      this.UserModel.findOne({where: {name: userName}})
        .then((user) => user.getUser({where: {}, through: {isAccepted: false}, attributes: ['name', 'email'], includeIgnoreAttributes: false}))
        .then((pendingInvitations) => resolve(pendingInvitations))
        .catch((error) => {
          log('Database error!', error.message);
          reject('Database error!');
        });
    });
  }
  
  inviteFriend(userName, userToInviteName) {
    return new Promise((resolve, reject) => {
      let userToInvite = null;
      this.UserModel.findOne({where: {name: userToInviteName}})
        .then((_userToInvite) => userToInvite = _userToInvite)
        .then(() => this.UserModel.findOne({where: {name: userName}}))
        .then((user) => user.addFriend(userToInvite, {through: {isAccepted: false}}))
        .then((created) => resolve(created))
        .catch((error) => {
          log('Database error!', error.message);
          reject('Database error!');
        });
      });
  }


  acceptInvitation(userName, userToAcceptName) {
    return new Promise((resolve, reject) => {
      let userToAccept = null;
      let user = null;

      this.UserModel.findOne({where: {name: userToAcceptName}})
        .then((_userToAccept) => userToAccept = _userToAccept)
        .then(() => this.UserModel.findOne({where: {name: userName}}))
        .then((_user) => user = _user)
        .then(() => this.FriendsModel.findOne({where:{user: userToAccept.id, friend: user.id}}))
        .then((relation) => {
          relation.isAccepted = true;
          relation.save();
        })
        .then(() => user.addFriend(userToAccept, {through: {isAccepted: true}}))
        .then((result) => resolve(result))
        .catch((error) => {
          log('Database error!', error.message);
          reject('Database error!');
        });
    });
  }
}


module.exports = UserService;