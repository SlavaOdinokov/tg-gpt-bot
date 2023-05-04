import { Scenes } from 'telegraf';

import { IStateData } from '../../types';
import { greetingsMsg } from '../../constants/messages';

export const stepStart = async (ctx: Scenes.WizardContext<Scenes.WizardSessionData>) => {
  try {
    const state = ctx.wizard.state as IStateData;
    state.username = ctx.from?.username || '';
    ctx.replyWithHTML(greetingsMsg(state.username));
    return ctx.scene.leave();
  } catch (err) {
    console.error('Catch start:', err);
    ctx.reply(err.message);
  }
};
