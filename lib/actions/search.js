'use strict';

const {messages} = require('elasticio-node');
const {createClient} = require('../baseClient');

exports.process = async function (msg, cfg) {
  const client = await createClient(cfg);

  const searchOpts = {
    scope: msg.body.scope,
    filter: msg.body.filter
  };
  const searchResults = await client.search(msg.body.base, searchOpts);
  searchResults.entries.forEach(entry => {
    this.emit('data', messages.newMessageWithBody(entry.object));
  });

  await client.unbind();
};
