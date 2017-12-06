/* eslint-disable no-unused-expressions */
'use strict';

const {expect} = require('chai');
const fs = require('fs');
const sinon = require('sinon');

const search = require('../lib/actions/search');
const verifyCredentials = require('../verifyCredentials');

describe('Integration Test', function () {
  let url;
  let user;
  let password;
  let base;
  let cfg;
  let emitter;

  this.timeout(10000);
  before(function () {
    if (fs.existsSync('.env')) {
      require('dotenv').config();
    }

    url = process.env.LDAP_URL;
    user = process.env.LDAPUSER;
    password = process.env.PASSWORD;
    base = process.env.BASE;
  });

  beforeEach(function () {
    cfg = {
      url,
      user,
      password
    };

    emitter = {
      emit: sinon.spy()
    };
  });

  describe('Search Tests', function () {
    it('All Data In One Page', async function () {
      const msg = {
        body: {
          filter: '(objectclass=*)',
          scope: 'one',
          base
        }
      };
      await search.process.call(emitter, msg, cfg, null);

      expect(emitter.emit.withArgs('data').callCount).to.be.equal(4);
    });
  });

  describe('Verify Credentials Tests', function () {
    it('Valid Credentials', async function () {
      const verificationResult = await verifyCredentials(cfg);
      expect(verificationResult).to.be.true;
    });

    it('Invalid Credentials', async function () {
      cfg.password = 'some wrong password';
      const verificationResult = await verifyCredentials(cfg);
      expect(verificationResult).to.be.false;
    });
  });
});
