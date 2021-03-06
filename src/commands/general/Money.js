const { Command, Argument, ArgumentDefault } = require('patron.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../../data/messages.json');

class Money extends Command {
  constructor() {
    super({
      names: ['cash', 'balance', 'money', 'bal'],
      groupName: 'general',
      description: 'View the wealth of anyone.',
      args: [
        new Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          example: 'Nibba You Cray#3333',
          defaultValue: ArgumentDefault.Member,
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const dbUser = args.member.id === msg.member.id ? msg.dbUser : await args.member.dbUser();

    return msg.channel.sendMessage(StringUtil.format(
      messages.commands.money,
      StringUtil.boldify(`${args.member.user.username}#${args.member.user.discriminator}`),
      NumberUtil.format(dbUser.cash)
    ));
  }
}

module.exports = new Money();
