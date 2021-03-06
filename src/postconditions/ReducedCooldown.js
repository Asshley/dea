const { Postcondition } = require('patron.js');
const {
  INVESTMENTS: { CONVOY: { COOLDOWN_REDUCTION: CD_REDUCTION } },
  INVESTMENT_NAMES
} = require('../utility/Constants.js');
const Util = require('../utility/Util.js');
const handler = require('../services/handler.js');

class ReducedCooldown extends Postcondition {
  constructor() {
    super({ name: 'reducedcooldown' });
  }

  run(msg, result) {
    if (msg.dbUser.investments.includes(INVESTMENT_NAMES.CONVOY) && result.success !== false) {
      return Util.MULTI_MUTEX.sync(msg.channel.guild.id, async () => {
        const { command } = await handler.parseCommand(msg, msg._client.config.prefix.length);

        if (!command.hasCooldown) {
          return;
        }

        const { cooldowns: { users, time } } = command;
        const userCD = users[`${msg.author.id}-${msg.channel.guild.id}`].resets;

        users[`${msg.author.id}-${msg.channel.guild.id}`].resets = userCD - (time * CD_REDUCTION);
      });
    }
  }
}

module.exports = new ReducedCooldown();
