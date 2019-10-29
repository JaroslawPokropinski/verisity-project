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
  constructor(UserModel, FriendsRelationModel) {
    this.UserModel = UserModel;
    this.FriendsRelationModel = FriendsRelationModel;
    log(JSON.stringify(UserModel));
    log(JSON.stringify(FriendsRelationModel));
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
    //TODO
  }
  
  inviteFriend(userName, userToInviteName) {
    return new Promise((resolve, reject) => {
      let userId = null;
      let userToInviteId = null;

      this._getUserId(userName)
        .then((_id) => {
          userId = _id;
          this._getUserId(userToInviteName);
        })
        .then((_id) => {
          userToInviteId = _id;
          this.FriendsRelationModel.count({where: {user: userId, friend: userToInviteId}})
        })
        .then((count) => {
          if(count !== 0) {
            reject(userName + ' is already friend with ' + userToInviteName + '!');
          }
        })
        .then(() => this.FriendsRelationModel.create({ user: userId, friend: userToInviteId, isAccepted: false }))
        .then((newRelation) => {
          this.FriendsRelationModel.create({ user: userToInviteId, friend: userId, isAccepted: true });
          resolve(newRelation);
        })
        .catch((error) => reject(error));
      });
  }


  acceptInvitation(userName, userToAcceptName) {
    return new Promise((resolve, reject) => {
      let userId = null;
      let userToAcceptId = null;

      this._getUserId(userName)
        .then((_id) => {
          userId = _id;
          this._getUserId(userToAcceptName);
        })
        .then((_id) => {
          userToAcceptId = _id;
          this.FriendsRelationModel.findOne({where: {user: userToAcceptId, friend: userId}})
        })
        .then((friendsRelation) => {
          if(friendsRelation === null) {
            reject('There is no invitation from ' + userToAcceptName + ' to ' + userName + '!');
          }
          if(friendsRelation.isAccepted === true) {
            reject('Invitation is already accepted!');
          }
          
          friendsRelation.isAccepted = true;
          friendsRelation.save().then(() => {});
          resolve(friendsRelation);
        });
    });
  }
}


module.exports = UserService;