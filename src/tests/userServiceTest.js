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
        .then(() => userService.cryptPassword('admin'))
        .then((hash) =>
          UserModel.create({
            login: 'admin',
            hash_password: hash,
          }))
        .then(() => {
          userService.getUser('admin', 'admin').then((user) => {
            chai.expect(user.login).to.equal('admin');
            done();
          }).catch((err) => {
            done(err);
          })
        });
    });

    it("getUser should add user to db", (done) => {
      database.sync().then(() => userService.addUser('test_user', 'test password'))
        .then(() => UserModel.findAndCountAll({ where: { login: 'test_user' } }))
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
            login: 'test_user',
            hash_password: hash,
          }))
        .then(() => userService.addUser('test_user', 'test password2'))
        .then(() => done(true))
        .catch(() => done());
    });
  });
});