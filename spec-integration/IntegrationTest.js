/* eslint-disable no-unused-expressions, import/no-extraneous-dependencies */

const logger = require('@elastic.io/component-logger')();
const { expect } = require('chai');
const fs = require('fs');
const sinon = require('sinon');

const search = require('../lib/actions/search');
const verifyCredentials = require('../verifyCredentials');

describe('Integration Test', () => {
  let url;
  let user;
  let password;
  let base;
  let cfg;
  let emitter;

  before(() => {
    if (fs.existsSync('.env')) {
      // eslint-disable-next-line global-require
      require('dotenv').config();
    }

    url = process.env.LDAP_URL;
    user = process.env.LDAPUSER;
    password = process.env.PASSWORD;
    base = process.env.BASE;
  });

  beforeEach(() => {
    cfg = {
      url,
      user,
      password,
    };

    emitter = {
      logger,
      emit: sinon.spy(),
    };
  });

  describe('Search Tests', async () => {
    it('All Data In One Page', async () => {
      const msg = {
        body: {
          filter: '(objectclass=*)',
          scope: 'one',
          base,
        },
      };
      await search.process.call(emitter, msg, cfg, null);

      expect(emitter.emit.withArgs('data').callCount).to.be.equal(21);
    });
  });

  describe('Verify Credentials Tests', () => {
    it('Valid Credentials', async () => {
      const verificationResult = await verifyCredentials(cfg);
      expect(verificationResult).to.be.true;
    });

    it('Invalid Credentials', async () => {
      cfg.password = 'some wrong password';
      const verificationResult = await verifyCredentials(cfg);
      expect(verificationResult).to.be.false;
    });
  });
});
