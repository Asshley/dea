const { Command, Context } = require('patron.js');
const {
  RESTRICTIONS: { LOTTERY, MINIMUM_MESSAGE_LENGTH },
  CHANNEL_TYPES
} = require('../../utility/Constants.js');
const StringUtil = require('../../utility/StringUtil.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const messages = require('../../../data/messages.json');
const cooldowns = require('../../../data/cooldowns.json');

class Info extends Command {
  constructor() {
    super({
      names: ['info', 'information', 'cashinfo', 'cashhelp'],
      groupName: 'system',
      description: 'All the information about the cash system.',
      usableContexts: [Context.DM, Context.Guild]
    });
  }

  async run(msg) {
    await msg.author.DM(StringUtil.format(
      messages.commands.info.message,
      msg._client.user.username,
      NumberUtil.msToTime(cooldowns.miscellanea.messageCash).seconds,
      MINIMUM_MESSAGE_LENGTH,
      NumberUtil.toUSD(msg._client.config.baseCPM),
      LOTTERY.MAXIMUM_CASH,
      msg._client.config.prefix,
      msg._client.config.prefix,
      msg._client.config.prefix,
      msg._client.user.username,
      msg._client.user.username,
      msg._client.config.prefix
    ));

    if (msg.channel.type !== CHANNEL_TYPES.DM) {
      return msg.createReply(StringUtil.format(
        messages.commands.info.dm, msg._client.user.username
      ));
    }
  }
}

module.exports = new Info();
