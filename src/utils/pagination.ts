import { Scenes } from 'telegraf';
import { Message } from 'telegraf/typings/core/types/typegram';

import { Command, IStateData } from '../types';
// import { resultMsg } from '../constants/messages';

export const paginationResult = async (
  ctx: Scenes.WizardContext<Scenes.WizardSessionData>,
  page: number
): Promise<Message.TextMessage> => {
  // const { items } = ctx.wizard.state as IStateData;
  const items = [];
  const keyboards: Command[][] = [];
  let keyboardString: Command[] = [];

  let limit = 10;
  let pages = Math.ceil(items.length / limit);
  let currPage = page > pages ? pages : page;
  // let msg = resultMsg(items.length);
  let msg = '';

  const startSplice = currPage > 1 ? currPage * limit - limit : currPage - 1;
  const paginationItems = [...items].splice(startSplice, limit);

  for (let i = 0; i < paginationItems.length; i++) {
    const number = i + 1 + startSplice;
    const { id, art, name, maker } = paginationItems[i];
    keyboardString.push({ text: `${number}`, callback_data: `id::${id}` });

    if (keyboardString.length % 5 === 0) {
      keyboards.push(keyboardString);
      keyboardString = [];
    }

    msg += `${number}. ${art} ${name} ${maker}\n`;
  }

  const buttons: Command[] = [
    { text: '<<', callback_data: `prev-${currPage}` },
    { text: `${currPage}/${pages}`, callback_data: 'pages' },
    { text: '>>', callback_data: `next-${currPage}` }
  ];

  if (pages > 1) {
    keyboards.push(keyboardString);
    keyboards.push(buttons);
  } else {
    keyboards.push(keyboardString);
  }

  const response = await ctx.replyWithHTML(msg, {
    reply_markup: {
      inline_keyboard: keyboards,
      resize_keyboard: true
    }
  });

  return response;
};
