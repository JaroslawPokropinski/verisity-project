'use strict';
const chai = require('chai');
const path = require('path');
const { Sequelize } = require('sequelize');
const UserService = require('../services/UserService');

describe("UserService", function () {
  describe("password encorder", function () {
    let database = null;
    let UserModel = null;
    let userService = null;

    beforeEach(() => {
      database = new Sequelize('sqlite::memory:', { logging: null });
      UserModel = database.import(path.join(__dirname, '..', 'models', 'UserModel'));
      userService = new UserService(UserModel);
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
});