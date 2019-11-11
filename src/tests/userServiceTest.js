'use strict';
const chai = require('chai');
const path = require('path');
const { Sequelize } = require('sequelize');
const UserService = require('../services/UserService');

describe("UserService", function () {
  describe("password encorder", function () {
    let database = null;
    let UserModel = null;
    let FriendsModel = null;
    let userService = null;

    beforeEach(() => {
      database = new Sequelize('sqlite::memory:', { logging: null });
      UserModel = database.import(path.join(__dirname, '..', 'models', 'UserModel'));
      FriendsModel = database.import(path.join(__dirname, '..', 'models', 'FriendsModel'));
      userService = new UserService(UserModel, FriendsModel);
    })

    it("getUser should return admin", (done) => {
      database.sync()
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
      database.sync().then(() => userService.addUser('test_user@example.com', 'test_user', 'test password'))
        .then(() => UserModel.findAndCountAll({ where: { email: 'test_user@example.com' } }))
        .then((result) => {
          chai.expect(result.count).to.equal(1);
          done();
        })
        .catch((err) => done(err));
    });


    it("getUser should fail adding user with same login", (done) => {
      database.sync()
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
    let userService = null;

    beforeEach(() => {
      database = new Sequelize('sqlite::memory:', { logging: null });
      UserModel = database.import(path.join(__dirname, '..', 'models', 'UserModel'));
      FriendsModel = database.import(path.join(__dirname, '..', 'models', 'FriendsModel'));
      userService = new UserService(UserModel, FriendsModel);
    })

    it("inviteFriend should send invitation from one user to another", (done) => {
      database.sync()
        .then(() => userService.addUser('asd@asd.pl', 'user1', 'user1'))
        .then(() => userService.addUser('qwe@qwe.pl', 'user2', 'user2'))
        .then(() => userService.inviteFriend('user1', 'user2'))
        .then(() => {
          let user1 = null;

          UserModel.findOne({where: {name: 'user1'}})
            .then((_user1) => user1 = _user1)
            .then(() => user1.getFriend({where: {}, through: {isAccepted: false}}))
            .then((invited_user) => {
              chai.expect(invited_user).to.not.equal(null);
              chai.expect(invited_user[0].name).to.equal('user2');
            })
            .then((result) => done(result))
            .catch((err) => done(err));
        })
        .catch((err) => done(err));
    });

    it("acceptInvitation should accept invitation from one user to another", (done) => {
      database.sync()
      .then(() => userService.addUser('asd@asd.pl', 'user1', 'user1'))
      .then(() => userService.addUser('qwe@qwe.pl', 'user2', 'user2'))
      .then(() => userService.inviteFriend('user1', 'user2'))
      .then(() => userService.acceptInvitation('user2', 'user1'))
      .then(() => {
        let user = null;

        UserModel.findOne({where: {name: 'user1'}})
            .then((_user) => user = _user)
            .then(() => user.getFriend({where: {}, through: {isAccepted: true}}))
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
      database.sync()
      .then(() => userService.addUser('asd@asd.pl', 'user1', 'user1'))
      .then(() => userService.addUser('qwe@qwe.pl', 'user2', 'user2'))
      .then(() => userService.addUser('zxc@zxc.pl', 'user3', 'user3'))
      .then(() => userService.inviteFriend('user1', 'user2'))
      .then(() => userService.acceptInvitation('user2', 'user1'))
      .then(() => userService.inviteFriend('user3', 'user2'))
      .then(() => userService.acceptInvitation('user2', 'user3'))
      .then(() => userService.getFriendsList('user2'))
      .then((friendsList) => {
        chai.expect(JSON.stringify(friendsList)).to.equal('[{"name":"user1","email":"asd@asd.pl"},{"name":"user3","email":"zxc@zxc.pl"}]');
      })
      .then(() => done())
      .catch((err) => done(err));
    });

    it("getPendingInvitations should return list of invitations for specified user", (done) => {
      database.sync()
      .then(() => userService.addUser('asd@asd.pl', 'user1', 'user1'))
      .then(() => userService.addUser('qwe@qwe.pl', 'user2', 'user2'))
      .then(() => userService.inviteFriend('user1', 'user2'))
      .then(() => userService.getPendingInvitations('user2'))
      .then((invitations) => {
        chai.expect(JSON.stringify(invitations)).to.equal('[{"name":"user1","email":"asd@asd.pl"}]');
      })
      // .then(() => userService.UserModel.findOne({where: {name: 'user1'}}).then((user) => user.getFriend({logging: console.log})).then((friends) => {console.log(friends); console.log(JSON.stringify(friends));}))
      .then(() => done())
      .catch((err) => done(err));
    });
  });
});