import { Composer, Scenes } from 'telegraf';
import { message } from 'telegraf/filters';

import { searchHandler } from './handle';
import { invalidSearchRequestMsg } from '../../constants/messages';

export const stepSearch = new Composer<Scenes.WizardContext>();

stepSearch.on(message('text'), async ctx => {
  await searchHandler(ctx, ctx.message.text);
});

stepSearch.on(message('voice'), async ctx => {
  await searchHandler(ctx, ctx.message.voice);
});

stepSearch.on('message', async ctx => {
  ctx.replyWithHTML(invalidSearchRequestMsg);
  return ctx.scene.leave();
});
