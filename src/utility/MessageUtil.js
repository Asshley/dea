const {
  MISCELLANEA: { DECIMAL_ROUND_AMOUNT: EVEN_VALUE }
} = require('./Constants.js');
const Random = require('./Random.js');
const { colors } = require('../../data/config.json');

class MessageUtil {
  static sendFieldsMessage(channel, fields, inline = true, color = null) {
    const embed = {
      color: color ? color : Random.arrayElement(colors.defaults),
      fields: []
    };

    for (let i = 0; i < fields.length - 1; i++) {
      if (!(i % EVEN_VALUE)) {
        embed.fields.push({
          name: fields[i], value: fields[i + 1], inline
        });
      }
    }

    return channel.createMessage({ embed });
  }

  static sendMessage(channel, description, options = {}) {
    const embed = {
      color: options.color ? options.color : Random.arrayElement(colors.defaults),
      description
    };

    if (options.title) {
      embed.title = options.title;
    }

    if (options.author) {
      embed.author = {
        name: options.author.name, icon_url: options.author.icon, url: options.author.url
      };
    }

    if (options.footer) {
      embed.footer = {
        text: options.footer.text, icon_url: options.footer.icon
      };
    }

    if (options.timestamp) {
      embed.timestamp = new Date();
    }

    return channel.createMessage({ embed });
  }

  static async notify(member, message, type) {
    if (!member) {
      return false;
    }

    const dbUser = await member.dbUser();

    if (dbUser.notifications.includes(type.toLowerCase())) {
      return;
    }

    return member.tryDM(message, { guild: member.guild });
  }
}

module.exports = MessageUtil;
