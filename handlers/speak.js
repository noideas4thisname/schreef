const azure = require('azure-storage');
const log4js = require('log4js');

const LOG = log4js.getLogger('speak');

module.exports = {
    name: 'speak',
    command: 'speak',
    handler: speak
};

function stock(channel, message, params) {

}