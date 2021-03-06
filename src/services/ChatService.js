const {
  RESTRICTIONS: { LOTTERY, MINIMUM_MESSAGE_LENGTH },
  INVESTMENTS,
  INVESTMENT_NAMES,
  ODDS
} = require('../utility/Constants.js');
const Random = require('../utility/Random.js');
const StringUtil = require('../utility/StringUtil.js');
const NumberUtil = require('../utility/NumberUtil.js');
const messages = require('../../data/messages.json');
const cooldowns = require('../../data/cooldowns.json');
const DEA = '496493687476453377';

class ChatService {
  constructor() {
    this.messages = {};
    this.lastReset = Date.now();
  }

  async applyCash(msg) {
    const key = `${msg.author.id}-${msg.channel.guild.id}`;
    const lastMessage = this.messages[key];
    const cooldown = msg.dbUser.investments.includes(INVESTMENT_NAMES.LINE) ? cooldowns
      .miscellanea.reducedMessageCash : cooldowns.miscellanea.messageCash;
    const cdOver = !lastMessage || Date.now() - lastMessage.time > cooldown;
    const longEnough = msg.content.length >= MINIMUM_MESSAGE_LENGTH;

    if (cdOver && longEnough) {
      const baseCPM = lastMessage ? lastMessage.cpm : msg._client.config.baseCPM;
      const { cpm, inc } = this.constructor
        .getCPM(msg.dbUser, baseCPM, msg._client.config.rateIncrement);
      let amount = cpm * msg.dbGuild.multiplier;

      this.messages[key] = {
        time: Date.now(),
        cpm,
        inc
      };

      if (ODDS.LOTTERY >= Random.roll()) {
        const maxCash = msg.guildID === DEA ? LOTTERY.DEA_MAXIMUM_CASH : LOTTERY.MAXIMUM_CASH;
        const minCash = msg.guildID === DEA ? LOTTERY.DEA_MINIMUM_CASH : LOTTERY.MINIMUM_CASH;
        const winnings = Random.nextFloat(minCash, maxCash);

        amount += winnings;
        await msg.tryCreateReply(StringUtil.format(
          Random.arrayElement(messages.lottery), NumberUtil.toUSD(winnings)
        ));
      }

      return msg._client.db.userRepo.modifyCash(msg.dbGuild, msg.member, amount);
    }
  }

  static getCPM(dbUser, cpm, inc) {
    const { investments } = dbUser;
    let newInc = inc;

    if (investments.includes(INVESTMENT_NAMES.POUND)) {
      if (investments.includes(INVESTMENT_NAMES.KILO)) {
        newInc *= INVESTMENTS.KILO.CASH_MULTIPLIER;
      } else {
        newInc *= INVESTMENTS.POUND.CASH_MULTIPLIER;
      }
    }

    return {
      cpm: cpm + newInc,
      inc: newInc
    };
  }
}

module.exports = new ChatService();
