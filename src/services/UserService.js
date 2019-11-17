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
  constructor(UserModel, FriendsModel, MessageModel) {
    this.UserModel = UserModel;
    this.FriendsModel = FriendsModel;
    this.MessageModel = MessageModel;
    log(JSON.stringify(UserModel));
    log(JSON.stringify(FriendsModel));
    log(JSON.stringify(MessageModel));
  }

  cryptPassword(password) {
    return new Promise((resolve, reject) => {
      genSalt(10, function (err, salt) {
        if (err) {
          reject({ errorMessage: 'Failed to generate salt!' });
          return;
        }
        hash(password, salt, function (err, _hash) {
          if (err) {
            reject({ errorMessage: 'Failed to hash password!' });
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
            reject({ errorMessage: 'Login or password are incorrect!' });
          }
          user = _user;
          return compare(password, user.hash_password);
        })
        .then((isCorrect) => {
          if (!isCorrect) {
            reject({ errorMessage: 'Login or password are incorrect!' });
          }
          resolve(user);
        })
        .catch((error) => {
          log('Database error!', error.message);
          reject({ errorMessage: 'Database error!' });
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
  getFriendsList(userName) {
    return new Promise((resolve, reject) => {
      let user = null;

      this.UserModel.findOne({where: {name: userName}})
      .then((_user) => {
        if (_user === null) {
          reject({ errorMessage: `There is no user with name = ${userName} in database!`});
        }
        user = _user;
      })
        .then(() => user.getFriend({where: {}, through: {where: {isAccepted: true}}, attributes: ['name', 'email'], includeIgnoreAttributes: false}))
        .then((friendsList) => resolve(friendsList))
        .catch((error) => {
          log('Database error!', error.message);
          reject({ errorMessage: 'Database error!' });
        });
    });
  }

  getPendingInvitations(userName) {
    return new Promise((resolve, reject) => {
      let user = null;

      this.UserModel.findOne({where: {name: userName}})
        .then((_user) => {
          if (_user === null) {
            reject({ errorMessage: `There is no user with name = ${userName} in database!`});
          }
          user = _user;
        })
        .then(() => user.getUser({where: {}, through: {where: {isAccepted: false}}, attributes: ['name', 'email'], includeIgnoreAttributes: false}))
        .then((pendingInvitations) => resolve(pendingInvitations))
        .catch((error) => {
          log('Database error!', error.message);
          reject({ errorMessage: 'Database error!' });
        });
    });
  }
  
  inviteFriend(userName, userToInviteName) {
    return new Promise((resolve, reject) => {
      let userToInvite = null;
      let user = null;

      this.UserModel.findOne({where: {name: userToInviteName}})
        .then((_userToInvite) => {
          if (_userToInvite === null) {
            reject({ errorMessage: `There is no user with name = ${userToInviteName} in database!`});
          }
          userToInvite = _userToInvite;
        })
        .then(() => this.UserModel.findOne({where: {name: userName}}))
        .then((_user) => {
          if (_user === null) {
            reject({ errorMessage: `There is no user with name = ${userName} in database!`});
          }
          user = _user;
        })
        .then(() => user.addFriend(userToInvite, {through: {isAccepted: false}}))
        .then((created) => resolve(created))
        .catch((error) => {
          log('Database error!', error.message);
          reject({ errorMessage: 'Database error!' });
        });
      });
  }

  acceptInvitation(userName, userToAcceptName) {
    return new Promise((resolve, reject) => {
      let userToAccept = null;
      let user = null;

      this.UserModel.findOne({where: {name: userToAcceptName}})
        .then((_userToAccept) => {
          if (_userToAccept === null) {
            reject({ errorMessage: `There is no user with name = ${userToAcceptName} in database!`});
          }
          userToAccept = _userToAccept;
        })
        .then(() => this.UserModel.findOne({where: {name: userName}}))
        .then((_user) => {
          if (_user === null) {
            reject({ errorMessage: `There is no user with name = ${userName} in database!`});
          }
          user = _user;
        })
        .then(() => this.FriendsModel.findOne({where:{user: userToAccept.id, friend: user.id, isAccepted: false}}))
        .then((relation) => {
          if(relation === null) {
            log(`Users are friends already, or there is no invitation from user ${userToAcceptName} to user ${userName}!`);
            reject({ errorMessage: `Users are friends already, or there is no invitation from user ${userToAcceptName} to user ${userName}!` });
          }
          relation.isAccepted = true;
          relation.save();
        })
        .then(() => user.addFriend(userToAccept, {through: {isAccepted: true}}))
        .then((result) => resolve(result))
        .catch((error) => {
          log('Database error!', error.message);
          reject({ errorMessage: 'Database error!' });
        });
    });
  }

  // Message functions
  sendMessage(senderName, receiverName, msgContent) {
    return new Promise((resolve, reject) => {
      let sender = null;
      let receiver = null;
      let relation = null;

      this.UserModel.findOne({where: {name: senderName}})
        .then((_sender) => {
          if (_sender === null) {
            reject({ errorMessage: `There is no user with name = ${senderName} in database!`});
          }
          sender = _sender;
        })
        .then(() => this.UserModel.findOne({where: {name: receiverName}}))
        .then((_receiver) => {
          if (_receiver === null) {
            reject({ errorMessage: `There is no user with name = ${receiverName} in database!`});
          }
          receiver = _receiver;
        })
        .then(() => this.FriendsModel.findOne({where: {user: sender.id, friend: receiver.id}}))
        .then((_relation) => {
          if (_relation === null || _relation.isAccepted == false) {
            log(`You are not friend with user ${receiverName}!`);
            reject({ errorMessage: `You are not friend with user ${receiverName}!`});
          }
          relation = _relation;
        })
        .then(() => this.MessageModel.create({content: msgContent}))
        .then((msg) => msg.setFriends_relation(relation)) // TODO: change friends table name
        .then((result) => resolve(result))
        .catch((error) => {
          log('Database error!', error.message);
          reject({ errorMessage: 'Database error!' });
          // reject(error.message);
        });
    });
  }

  getMessages(senderName, receiverName) {
    return new Promise((resolve, reject) => {
      let sender = null;
      let receiver = null;
      let relation = null;

      this.UserModel.findOne({where: {name: senderName}})
        .then((_sender) => {
          if (_sender === null) {
            reject({ errorMessage: `There is no user with name = ${senderName} in database!`});
          }
          sender = _sender;
        })
        .then(() => this.UserModel.findOne({where: {name: receiverName}}))
        .then((_receiver) => {
          if (_receiver === null) {
            reject({ errorMessage: `There is no user with name = ${receiverName} in database!`});
          }
          receiver = _receiver;
        })
        .then(() => this.FriendsModel.findOne({where: {user: sender.id, friend: receiver.id, isAccepted: true}}))
        .then((rel) => {
          if (rel === null) {
            reject({ errorMessage: `You are not friend with user ${receiverName}!`});
          }
          relation = rel;
        })
        .then(() => relation.getMessages())
        .then((messages) => {
          var msg = messages.map(msg => msg.toJSON());
          msg.map(i => i.author = senderName);
          resolve(msg);
        })
        .catch((error) => {
          log('Database error!', error.message);
          reject({ errorMessage: 'Database error!' });
        });
    });
  }

  getConversation(senderName, receiverName) {
    return new Promise((resolve, reject) => {
      let sender = null;
      let receiver = null;
      let resultList = [];
      let relation = null;

      this.UserModel.findOne({where: {name: senderName}})
        .then((_sender) => {
          if (_sender === null) {
            reject({ errorMessage: `There is no user with name = ${senderName} in database!`});
          }
          sender = _sender;
        })
        .then(() => this.UserModel.findOne({where: {name: receiverName}}))
        .then((_receiver) => {
          if (_receiver === null) {
            reject({ errorMessage: `There is no user with name = ${receiverName} in database!`});
          }
          receiver = _receiver;
        })
        .then(() => this.FriendsModel.findOne({where: {user: sender.id, friend: receiver.id, isAccepted: true}}))
        .then((_relation) => {
          if (_relation === null) {
            reject({ errorMessage: `You are not friend with user ${receiverName}!`});
          }
          relation = _relation;
        })
        .then(() => relation.getMessages())
        .then((messages) => messages.map(msg => msg.toJSON()))
        .then((messages) => {
          messages.map(msg => msg.author = senderName);
          resultList = resultList.concat(messages);
        })
        .then(() => this.FriendsModel.findOne({where: {user: receiver.id, friend: sender.id, isAccepted: true}}))
        .then((_relation) => {
          if (_relation === null) {
            reject({ errorMessage: `You are not friend with user ${receiverName}!`});
          }
          relation = _relation;
        })
        .then(() => relation.getMessages())
        .then((messages) => messages.map(msg => msg.toJSON()))
        .then((messages) => {
          messages.map(msg => msg.author = receiverName);
          resultList = resultList.concat(messages);
        })
        .then(() => resolve(resultList))
        .catch((error) => {
          log('Database error!', error.message);
          reject({ errorMessage: 'Database error!' });
        });
    });
  }

}


module.exports = UserService;