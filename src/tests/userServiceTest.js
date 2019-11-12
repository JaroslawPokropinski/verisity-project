'use strict';
const chai = require('chai');
const path = require('path');
const { Sequelize } = require('sequelize');
const UserService = require('../services/UserService');
const getDatabase = require('../config/dbConfig');

describe("UserService", function () {
  describe("password encorder", function () {
    let database = null;
    let UserModel = null;
    let FriendsModel = null;
    let MessageModel = null;
    let userService = null;

    beforeEach(() => {
      database = getDatabase();
      UserModel = database['models']['user'];
      FriendsModel = database['models']['friends_relations'];
      MessageModel = database['models']['message'];
      userService = new UserService(UserModel, FriendsModel, MessageModel);
    })

    it("getUser should return admin", (done) => {
      database.sync({force: true})
        .then(() => userService.cryptPassword('adminadmin'))
        .then((hash) =>
          UserModel.create({
            name: 'admin',
            email: 'admin@example.com',
            hash_password: hash,
          }))
        .then(() => {
          userService.getUser('admin@example.com', 'adminadmin').then((user) => {
            chai.expect(user.name).to.equal('admin');
            done();
          }).catch((err) => {
            done(err);
          })
        });
    });

    it("addUser should add user to db", (done) => {
      database.sync({force: true})
        .then(() => userService.addUser('test_user@example.com', 'test_user', 'test password'))
        .then(() => UserModel.findAndCountAll({ where: { email: 'test_user@example.com' } }))
        .then((result) => {
          chai.expect(result.count).to.equal(1);
          done();
        })
        .catch((err) => done(err));
    });


    it("getUser should fail adding user with same login", (done) => {
      database.sync({force: true})
        .then(() => userService.cryptPassword('test password'))
        .then((hash) =>
          UserModel.create({
            email: 'test_user@example.com',
            name: 'test_user',
            hash_password: hash,
          }))
        .then(() => userService.addUser('test_user@example.com', 'test_user2', 'test password2'))
        .then(() => done(true))
        .catch(() => done());
    });
  });

  describe("friends relation", function() {
    let database = null;
    let UserModel = null;
    let FriendsModel = null;
    let MessageModel = null;
    let userService = null;

    beforeEach(() => {
      database = getDatabase();
      UserModel = database['models']['user'];
      FriendsModel = database['models']['friends_relations'];
      MessageModel = database['models']['message'];
      userService = new UserService(UserModel, FriendsModel, MessageModel);
    })

    it("inviteFriend should send invitation from one user to another", (done) => {
      database.sync({force: true})
        .then(() => userService.addUser('asd@asd.pl', 'user1', 'user1'))
        .then(() => userService.addUser('qwe@qwe.pl', 'user2', 'user2'))
        .then(() => userService.inviteFriend('user1', 'user2'))
        .then(() => {
          let user1 = null;

          UserModel.findOne({where: {name: 'user1'}})
            .then((_user1) => user1 = _user1)
            .then(() => user1.getFriend({where: {}, through: {where: {isAccepted: false}}}))
            .then((invited_user) => {
              chai.expect(invited_user).to.not.equal(null);
              chai.expect(invited_user[0].name).to.equal('user2');
            })
            .then(() => user1.getFriend({where: {}, through: {where: {isAccepted: true}}}))
            .then((empty_list) => {
              chai.expect(empty_list).to.be.empty;
            })
            .then((result) => done(result))
            .catch((err) => done(err));
        })
        .catch((err) => done(err));
    });

    it("acceptInvitation should accept invitation from one user to another", (done) => {
      database.sync({force: true})
      .then(() => userService.addUser('asd@asd.pl', 'user1', 'user1'))
      .then(() => userService.addUser('qwe@qwe.pl', 'user2', 'user2'))
      .then(() => userService.inviteFriend('user1', 'user2'))
      .then(() => userService.acceptInvitation('user2', 'user1'))
      .then(() => {
        let user = null;

        UserModel.findOne({where: {name: 'user1'}})
            .then((_user) => user = _user)
            .then(() => user.getFriend({where: {}, through: {where: {isAccepted: true}}}))
            .then((invited_user) => {
              chai.expect(invited_user).to.not.equal(null);
              chai.expect(invited_user[0].name).to.equal('user2');
            })
            .then((result) => done(result))
            .catch((err) => done(err));
      })
      .catch((err) => done(err));
    });

    it("getFriendsList should return list of friends for specified user", (done) => {
      database.sync({force: true})
      .then(() => userService.addUser('asd@asd.pl', 'user1', 'user1'))
      .then(() => userService.addUser('qwe@qwe.pl', 'user2', 'user2'))
      .then(() => userService.addUser('zxc@zxc.pl', 'user3', 'user3'))
      .then(() => userService.inviteFriend('user1', 'user2'))
      .then(() => userService.acceptInvitation('user2', 'user1'))
      .then(() => userService.inviteFriend('user3', 'user2'))
      .then(() => userService.getFriendsList('user2'))
      .then((friendsList) => {
        chai.expect(JSON.stringify(friendsList)).to.equal('[{"name":"user1","email":"asd@asd.pl"}]');
      })
      .then(() => userService.acceptInvitation('user2', 'user3'))
      .then(() => userService.getFriendsList('user2'))
      .then((friendsList) => {
        chai.expect(JSON.stringify(friendsList)).to.equal('[{"name":"user1","email":"asd@asd.pl"},{"name":"user3","email":"zxc@zxc.pl"}]');
      })
      .then(() => done())
      .catch((err) => done(err));
    });

    it("getPendingInvitations should return list of invitations for specified user", (done) => {
      database.sync({force: true})
      .then(() => userService.addUser('asd@asd.pl', 'user1', 'user1'))
      .then(() => userService.addUser('qwe@qwe.pl', 'user2', 'user2'))
      .then(() => userService.inviteFriend('user1', 'user2'))
      .then(() => userService.getPendingInvitations('user2'))
      .then((invitations) => {
        chai.expect(JSON.stringify(invitations)).to.equal('[{"name":"user1","email":"asd@asd.pl"}]');
      })
      .then(() => userService.acceptInvitation('user2', 'user1'))
      .then(() => userService.getPendingInvitations('user2'))
      .then((empty_list) => {
        chai.expect(empty_list).to.be.empty;
      })
      .then(() => done())
      .catch((err) => done(err));
    });
  });

  describe("messages", function () {
    let database = null;
    let UserModel = null;
    let FriendsModel = null;
    let MessageModel = null;
    let userService = null;

    beforeEach(() => {
      database = getDatabase();
      UserModel = database['models']['user'];
      FriendsModel = database['models']['friends_relations'];
      MessageModel = database['models']['message'];
      userService = new UserService(UserModel, FriendsModel, MessageModel);
    })

    it("sendMessage should send text message", (done) => {
      database.sync({force: true})
        .then(() => userService.addUser('asd@asd.pl', 'user1', 'user1'))
        .then(() => userService.addUser('qwe@qwe.pl', 'user2', 'user2'))
        .then(() => userService.inviteFriend('user1', 'user2'))
        .then(() => userService.acceptInvitation('user2', 'user1'))
        .then(() => userService.sendMessage('user1', 'user2', 'Asdasdasdasd.'))
        .then(() => userService.MessageModel.findOne({where: {id: 1}}))
        .then((msg) => {
          chai.expect(msg).not.to.be.null;
          chai.expect(msg.content).to.be.equal('Asdasdasdasd.');
        })
        .then(() => done())
        .catch((err) => done(err));
    });

    it("getMessages should return all messages sent by one user to another", (done) => {
      database.sync({force: true})
        .then(() => userService.addUser('asd@asd.pl', 'user1', 'user1'))
        .then(() => userService.addUser('qwe@qwe.pl', 'user2', 'user2'))
        .then(() => userService.inviteFriend('user1', 'user2'))
        .then(() => userService.acceptInvitation('user2', 'user1'))
        .then(() => userService.sendMessage('user1', 'user2', 'Asdasdasdasd.'))
        .then(() => userService.sendMessage('user1', 'user2', 'Qweqweqweqwe.'))
        .then(() => userService.getMessages('user1', 'user2'))
        .then((msgList) => {
          chai.expect(msgList).not.to.be.empty;
          chai.expect(msgList.length).to.be.equal(2);
          chai.expect(msgList[0].content).to.be.equal('Asdasdasdasd.');
          chai.expect(msgList[1].content).to.be.equal('Qweqweqweqwe.');
        })
        .then(() => done())
        .catch((err) => done(err));
    });
  });

});