const { Command, Argument } = require('patron.js');
const Util = require('../../utility/Util.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../../data/messages.json');

class Vault extends Command {
  constructor() {
    super({
      names: ['vault', 'gangvault'],
      groupName: 'items',
      description: 'See a gangs vault.',
      args: [
        new Argument({
          name: 'gang',
          key: 'gang',
          type: 'gang',
          example: 'Cloud9Swags',
          defaultValue: '',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    let { gang } = args;

    if (StringUtil.isNullOrWhiteSpace(gang.name)) {
      gang = msg.dbGang;

      if (!gang) {
        return msg.createErrorReply(messages.commands.vault.authorNotInGang);
      }
    }

    let description = '';
    const keys = Object.keys(gang.vault).filter(x => gang.vault[x] > 0);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const amount = gang.vault[key];
      const plural = StringUtil.capitialize(Util.pluralize(key, amount));

      description += `${plural}: ${amount}\n`;
    }

    if (StringUtil.isNullOrWhiteSpace(description)) {
      return msg.channel.createErrorMessage(StringUtil.format(
        messages.commands.vault.empty,
        gang.leaderId === msg.author.id ? 'Your gang' : `\`${gang.name}\``,
        gang.leaderId === msg.author.id ? 'it\'s' : 'their'
      ));
    }

    return msg.channel.sendMessage(description, { title: `${gang.name}'s Vault:` });
  }
}

module.exports = new Vault();
