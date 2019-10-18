'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');

chai.use(chaiHttp);

describe("Api routes", function () {
  describe("POST /", function () {
    it("should login user as admin", async () => {
      const res = await chai.request(app)
        .post('/api/login')
        .send({ login: 'admin', password: 'admin' });
      chai.expect(res.status).to.eql(200);
    });
  });
});