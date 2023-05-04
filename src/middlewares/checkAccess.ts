import fs from 'fs';

import { Context } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';

import { notAccessMsg } from '../constants/messages';

export const checkAccess = (ctx: Context<Update>, next: () => Promise<void>) => {
  const chanel = ctx.update as any;
  if (chanel.channel_post?.chat?.id) return ctx.reply("You can't run a bot in a channel 😞");

  try {
    const username = ctx.from?.username || '';

    const file = fs.readFileSync('./src/access/users.json', { encoding: 'utf-8' });
    const { users } = JSON.parse(file);

    for (let i = 0; i < users.length; i++) {
      if (users[i].username === username) return next();
    }

    return ctx.replyWithHTML(notAccessMsg(username));
  } catch (err) {
    console.log('Catch checkAccess:', err);
    ctx.reply(err.message);
  }
};
