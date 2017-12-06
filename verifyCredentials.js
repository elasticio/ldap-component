'use strict';

const {createClient} = require('./lib/baseClient');

module.exports = async function (cfg) {
  try {
    const client = await createClient(cfg);
    console.log('Bind successful. Attempting to unbind...');
    await client.unbind();
    console.log('Unbind successful.');
    return true;
  } catch (e) {
    // Workaround for https://github.com/elasticio/sailor-nodejs/issues/58
    console.log(`Exception: ${e.toString()} \n ${e.stack}`);
    return false;
  }
};
