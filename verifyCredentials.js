const logger = require('@elastic.io/component-logger')();

const { createClient } = require('./lib/baseClient');

module.exports = async function (cfg) {
  try {
    const client = await createClient.call({ logger }, cfg);
    logger.info('Bind successful. Attempting to unbind...');
    client.unbind();
    logger.info('Unbind successful. Credentials successfully verified');
    return true;
  } catch (e) {
    // Workaround for https://github.com/elasticio/sailor-nodejs/issues/58
    logger.error('Credentials verification failed!');
    return false;
  }
};
