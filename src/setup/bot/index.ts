import { Telegraf, Scenes, session } from 'telegraf';

import { commands } from '../../constants/bot';
import { stage } from './scenes';
import { exitOfBot } from '../../utils/telegramHelpers';
import { checkAccess, logger } from '../../middlewares';

export const setupBot = (token: string) => {
  const bot = new Telegraf<Scenes.WizardContext>(token);

  stage
    .command(commands.start.command, ctx => ctx.scene.enter('startScene'))
    .command(commands.exit.command, ctx => exitOfBot(ctx))
    .on('message', ctx => ctx.scene.enter('searchScene'));

  bot.use((ctx, next) => checkAccess(ctx, next));
  bot.use((ctx, next) => logger(ctx, next));
  bot.use(session(), stage.middleware());

  bot
    .command(commands.start.command, ctx => ctx.scene.enter('startScene'))
    .command(commands.exit.command, ctx => exitOfBot(ctx))
    .on('message', ctx => ctx.scene.enter('searchScene'));

  bot.launch();

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
};
