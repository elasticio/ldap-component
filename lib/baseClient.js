'use strict';

const LdapClient = require('promised-ldap');

module.exports.createClient = async function (cfg) {
  const client = new LdapClient({
    url: cfg.url
  });

  console.log(`Attempting to bind to ${cfg.url} ...`);
  try {
    await client.bind(cfg.user, cfg.password);
  } catch (e) {
    // Bind failures don't kill the connection.
    await client.unbind();
    throw e;
  }
  return client;
};
