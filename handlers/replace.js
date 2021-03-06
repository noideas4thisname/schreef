const log4js = require('log4js');
const format = require('format');

const LOG = log4js.getLogger('replace');

/**
 * This module replaces text in a previous message.
 */
module.exports = {
  name: 'replace',
  command: 'r',
  handler: replace,
};

function replace(channel, message, params) {
  params = params.split('/');
  let targetStr = params[0];
  const replaceStr = params[1];
  let flags = params[2] || '';
  const targetUser = params[3] || '';

  if (flags) {
    flags = flags.trim().toLowerCase();

    if (flags.search(/^(g|i|gi|ig)?$/) === -1) {
      channel.send(`Invalid flags: ${flags}. Only g (global) and i (ignore case) are allowed.`);
      return;
    }
  }

  if (flags.includes('i')) {
    targetStr = targetStr.toLowerCase();
  }

  channel.fetchMessages({ before: message.id })
    .then((messages) => {
      const targetMessage = findMatchingMessage(messages, targetStr, flags, targetUser);
      if (targetMessage) {
        const re = new RegExp(targetStr, flags);
        const newMessage = targetMessage.content.replace(re, replaceStr);
        channel.send(format('%s ***meant*** to say: %s', targetMessage.author.username, newMessage));
      } else {
        channel.send('No messages containing that string found');
      }
    })
    .catch((error) => {
      LOG.error(error);
      channel.send('Error getting messages for channel');
    });
}

function findMatchingMessage(messages, target, flags, targetUser) {
  return messages.find((message) => {
    let content = message.content;
    if (content.startsWith('.')) return false;
    if (targetUser && message.author.username !== targetUser) return false;
    if (flags.includes('i')) content = content.toLowerCase();
    return content.includes(target);
  });
}
