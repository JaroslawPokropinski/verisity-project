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
  getFriendsList(userName) {
    return new Promise((resolve, reject) => {
      this.UserModel.findOne({where: {name: userName}})
        .then((user) => user.getFriend({where: {}, through: {where: {isAccepted: true}}, attributes: ['name', 'email'], includeIgnoreAttributes: false}))
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
        .then((user) => user.getUser({where: {}, through: {where: {isAccepted: false}}, attributes: ['name', 'email'], includeIgnoreAttributes: false}))
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
        // .then(() => console.log(userToInvite))
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
        .then(() => this.FriendsModel.findOne({where:{user: userToAccept.id, friend: user.id, isAccepted: false}}))
        .then((relation) => {
          if(relation === null) {
            log(`Users are friends already, or there is no invitation from user ${userToAcceptName} to user ${userName}!`);
            reject(`Users are friends already, or there is no invitation from user ${userToAcceptName} to user ${userName}!`);
          }
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

  // Message functions
  sendMessage(senderName, receiverName, msgContent) {
    return new Promise((resolve, reject) => {
      let sender = null;
      let receiver = null;
      let relation = null;

      this.UserModel.findOne({where: {name: senderName}})
        .then((_sender) => sender = _sender)
        .then(() => this.UserModel.findOne({where: {name: receiverName}}))
        .then((_receiver) => receiver = _receiver)
        .then(() => this.FriendsModel.findOne({where: {user: sender.id, friend: receiver.id}}))
        .then((_relation) => relation = _relation)
        .then(() => {
          if (relation === null) {
            log(`You are not friend with user ${receiverName}`);
            reject({"error": `You are not friend with user ${receiverName}`});
          }
        })
        .then(() => this.MessageModel.create({content: msgContent}))
        .then((msg) => msg.setFriends_relation(relation)) // TODO: change friends table name
        .then((result) => resolve(result))
        .catch((error) => {
          log('Database error!', error.message);
          reject('Database error!');
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
        .then((_sender) => sender = _sender)
        .then(() => this.UserModel.findOne({where: {name: receiverName}}))
        .then((_receiver) => receiver = _receiver)
        .then(() => this.FriendsModel.findOne({where: {user: sender.id, friend: receiver.id, isAccepted: true}}))
        .then((rel) => relation = rel)
        .then(() => relation.getMessages())
        .then((messages) => {
          var msg = messages.map(msg => msg.toJSON());
          msg.map(i => i.author = senderName);
          resolve(msg);
        })
        .catch((error) => {
          log('Database error!', error.message);
          reject('Database error!');
        });
    });
  }

  getConversation(senderName, receiverName) {
    return new Promise((resolve, reject) => {
      let sender = null;
      let receiver = null;
      let resultList = [];

      this.UserModel.findOne({where: {name: senderName}})
        .then((_sender) => sender = _sender)
        .then(() => this.UserModel.findOne({where: {name: receiverName}}))
        .then((_receiver) => receiver = _receiver)
        .then(() => this.FriendsModel.findOne({where: {user: sender.id, friend: receiver.id, isAccepted: true}}))
        .then((relation) => relation.getMessages())
        .then((messages) => messages.map(msg => msg.toJSON()))
        .then((messages) => {
          messages.map(msg => msg.author = senderName);
          resultList = resultList.concat(messages);
        })
        .then(() => this.FriendsModel.findOne({where: {user: receiver.id, friend: sender.id, isAccepted: true}}))
        .then((relation) => relation.getMessages())
        .then((messages) => messages.map(msg => msg.toJSON()))
        .then((messages) => {
          messages.map(msg => msg.author = receiverName);
          resultList = resultList.concat(messages);
        })
        .then(() => resolve(resultList))
        .catch((error) => {
          log('Database error!', error.message);
          reject('Database error!');
        });
    });
  }

}


module.exports = UserService;