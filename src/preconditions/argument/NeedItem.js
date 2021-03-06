const { ArgumentPrecondition, PreconditionResult } = require('patron.js');

class NeedItem extends ArgumentPrecondition {
  constructor() {
    super({ name: 'needitem' });
  }

  async run(command, msg, argument, args, value) {
    const { dbUser } = msg;

    if (!dbUser.inventory[value.names[0]] || dbUser.inventory[value.names[0]] <= 0) {
      return PreconditionResult.fromError(command, 'you don\'t have any of this item.');
    }

    return PreconditionResult.fromSuccess();
  }
}

module.exports = new NeedItem();
