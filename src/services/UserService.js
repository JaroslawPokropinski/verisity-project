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
    this.peers = new Map();
    this.peerToId = new Map();
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

  setPeerId(email, id) {
    this.peers.set(email, id);
    this.peerToId.set(id, email);
  }

  getPeerId(email) {
    return this.peers.get(email);
  }

  dismissPeerId(id) {
    const email = this.peerToId.get(id);
    if (email) {
      this.peers.delete(email);
      this.peerToId.delete(id);
    }
  }

  //FriendsRelation function
  getFriendsList(userEmail) {
    return new Promise((resolve, reject) => {
      let user = null;

      this.UserModel.findOne({ where: { email: userEmail } })
        .then((_user) => {
          if (_user === null) {
            reject({ errorMessage: `There is no user with email = ${userEmail} in database!` });
          }
          user = _user;
        })
        .then(() => user.getFriend({ where: {}, through: { where: { isAccepted: true } }, attributes: ['name', 'email'], includeIgnoreAttributes: false }))
        .then((friendsList) => resolve(friendsList))
        .catch((error) => {
          log('Database error!', error.message);
          reject({ errorMessage: 'Database error!' });
        });
    });
  }

  getPendingInvitations(userEmail) {
    return new Promise((resolve, reject) => {
      let user = null;

      this.UserModel.findOne({ where: { email: userEmail } })
        .then((_user) => {
          if (_user === null) {
            reject({ errorMessage: `There is no user with email = ${userEmail} in database!` });
          }
          user = _user;
        })
        .then(() => user.getUser({ where: {}, through: { where: { isAccepted: false } }, attributes: ['name', 'email'], includeIgnoreAttributes: false }))
        .then((pendingInvitations) => resolve(pendingInvitations))
        .catch((error) => {
          log('Database error!', error.message);
          reject({ errorMessage: 'Database error!' });
        });
    });
  }
  
  inviteFriend(userEmail, userToInviteEmail) {
    return new Promise((resolve, reject) => {
      let userToInvite = null;
      let user = null;

      this.UserModel.findOne({ where: { email: userToInviteEmail } })
        .then((_userToInvite) => {
          if (_userToInvite === null) {
            reject({ errorMessage: `There is no user with email = ${userToInviteEmail} in database!` });
          }
          userToInvite = _userToInvite;
        })
        .then(() => this.UserModel.findOne({where: {email: userEmail}}))
        .then((_user) => {
          if (_user === null) {
            reject({ errorMessage: `There is no user with email = ${userEmail} in database!` });
          }
          user = _user;
        })
        .then(() => user.addFriend(userToInvite, { through: { isAccepted: false } }))
        .then((created) => resolve(created))
        .catch((error) => {
          log('Database error!', error.message);
          reject({ errorMessage: 'Database error!' });
        });
    });
  }

  acceptInvitation(userEmail, userToAcceptEmail) {
    return new Promise((resolve, reject) => {
      let userToAccept = null;
      let user = null;

      this.UserModel.findOne({ where: { email: userToAcceptEmail } })
        .then((_userToAccept) => {
          if (_userToAccept === null) {
            reject({ errorMessage: `There is no user with email = ${userToAcceptEmail} in database!` });
          }
          userToAccept = _userToAccept;
        })
        .then(() => this.UserModel.findOne({ where: { email: userEmail } }))
        .then((_user) => {
          if (_user === null) {
            reject({ errorMessage: `There is no user with email = ${userEmail} in database!` });
          }
          user = _user;
        })
        .then(() => this.FriendsModel.findOne({ where: { user: userToAccept.id, friend: user.id, isAccepted: false } }))
        .then((relation) => {
          if (relation === null) {
            log(`Users are friends already, or there is no invitation from user ${userToAcceptEmail} to user ${userEmail}!`);
            reject({ errorMessage: `Users are friends already, or there is no invitation from user ${userToAcceptEmail} to user ${userEmail}!` });
          }
          relation.isAccepted = true;
          relation.save();
        })
        .then(() => user.addFriend(userToAccept, { through: { isAccepted: true } }))
        .then((result) => resolve(result))
        .catch((error) => {
          log('Database error!', error.message);
          reject({ errorMessage: 'Database error!' });
        });
    });
  }

  // Message functions
  sendMessage(senderEmail, receiverEmail, msgContent) {
    return new Promise((resolve, reject) => {
      let sender = null;
      let receiver = null;
      let relation = null;

      this.UserModel.findOne({ where: { email: senderEmail } })
        .then((_sender) => {
          if (_sender === null) {
            reject({ errorMessage: `There is no user with email = ${senderEmail} in database!` });
          }
          sender = _sender;
        })
        .then(() => this.UserModel.findOne({ where: { email: receiverEmail } }))
        .then((_receiver) => {
          if (_receiver === null) {
            reject({ errorMessage: `There is no user with email = ${receiverEmail} in database!` });
          }
          receiver = _receiver;
        })
        .then(() => this.FriendsModel.findOne({ where: { user: sender.id, friend: receiver.id } }))
        .then((_relation) => {
          if (_relation === null || _relation.isAccepted == false) {
            log(`You are not friend with user ${receiverEmail}!`);
            reject({ errorMessage: `You are not friend with user ${receiverEmail}!` });
          }
          relation = _relation;
        })
        .then(() => this.MessageModel.create({ content: msgContent }))
        .then((msg) => msg.setFriends_relation(relation)) // TODO: change friends table name
        .then((result) => resolve(result))
        .catch((error) => {
          log('Database error!', error.message);
          reject({ errorMessage: 'Database error!' });
          // reject(error.message);
        });
    });
  }

  getMessages(senderEmail, receiverEmail) {
    return new Promise((resolve, reject) => {
      let sender = null;
      let receiver = null;
      let relation = null;

      this.UserModel.findOne({ where: { email: senderEmail } })
        .then((_sender) => {
          if (_sender === null) {
            reject({ errorMessage: `There is no user with email = ${senderEmail} in database!` });
          }
          sender = _sender;
        })
        .then(() => this.UserModel.findOne({ where: { email: receiverEmail } }))
        .then((_receiver) => {
          if (_receiver === null) {
            reject({ errorMessage: `There is no user with email = ${receiverEmail} in database!` });
          }
          receiver = _receiver;
        })
        .then(() => this.FriendsModel.findOne({ where: { user: sender.id, friend: receiver.id, isAccepted: true } }))
        .then((rel) => {
          if (rel === null) {
            reject({ errorMessage: `You are not friend with user ${receiverEmail}!` });
          }
          relation = rel;
        })
        .then(() => relation.getMessages())
        .then((messages) => {
          var msg = messages.map(msg => msg.toJSON());
          msg.map(i => i.author = sender.name);
          resolve(msg);
        })
        .catch((error) => {
          log('Database error!', error.message);
          reject({ errorMessage: 'Database error!' });
        });
    });
  }

  getConversation(senderEmail, receiverEmail) {
    return new Promise((resolve, reject) => {
      let sender = null;
      let receiver = null;
      let resultList = [];
      let relation = null;

      this.UserModel.findOne({ where: { email: senderEmail } })
        .then((_sender) => {
          if (_sender === null) {
            reject({ errorMessage: `There is no user with email = ${senderEmail} in database!` });
          }
          sender = _sender;
        })
        .then(() => this.UserModel.findOne({ where: { email: receiverEmail } }))
        .then((_receiver) => {
          if (_receiver === null) {
            reject({ errorMessage: `There is no user with email = ${receiverEmail} in database!` });
          }
          receiver = _receiver;
        })
        .then(() => this.FriendsModel.findOne({ where: { user: sender.id, friend: receiver.id, isAccepted: true } }))
        .then((_relation) => {
          if (_relation === null) {
            reject({ errorMessage: `You are not friend with user ${receiverEmail}!` });
          }
          relation = _relation;
        })
        .then(() => relation.getMessages())
        .then((messages) => messages.map(msg => msg.toJSON()))
        .then((messages) => {
          messages.map(msg => msg.author = sender.name);
          resultList = resultList.concat(messages);
        })
        .then(() => this.FriendsModel.findOne({ where: { user: receiver.id, friend: sender.id, isAccepted: true } }))
        .then((_relation) => {
          if (_relation === null) {
            reject({ errorMessage: `You are not friend with user ${receiverEmail}!` });
          }
          relation = _relation;
        })
        .then(() => relation.getMessages())
        .then((messages) => messages.map(msg => msg.toJSON()))
        .then((messages) => {
          messages.map(msg => msg.author = receiver.name);
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