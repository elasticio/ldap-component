const { messages } = require('elasticio-node');
const { createClient } = require('../baseClient');

exports.process = async function (msg, cfg) {
  const client = await createClient.call(this, cfg);

  const searchOpts = {
    scope: msg.body.scope,
    filter: msg.body.filter,
  };
  const searchResults = await client.search(msg.body.base, searchOpts);
  const { entries } = searchResults;

  for (let i = 0; i < entries.length; i++) {
    // eslint-disable-next-line no-await-in-loop
    await this.emit('data', messages.newMessageWithBody(entries[i].object));
  }

  client.unbind();
};
