const LdapClient = require('promised-ldap');

module.exports.createClient = async function (cfg) {
  const client = new LdapClient({
    url: cfg.url,
  });

  this.logger.info('Attempting to bind to provided url');
  try {
    await client.bind(cfg.user, cfg.password);
  } catch (e) {
    // Bind failures don't kill the connection.
    client.unbind();
    throw e;
  }
  return client;
};
