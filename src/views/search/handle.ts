import { Scenes } from 'telegraf';
import { code } from 'telegraf/format';

import { IStateData } from '../../types';
import { Voice } from 'telegraf/typings/core/types/typegram';
import { invalidSearchRequestMsg, searchWaitMsg } from '../../constants/messages';
import { ogg } from '../../converter';
import { openai } from '../../openai';

export const voiceHandle = async (ctx: Scenes.WizardContext<Scenes.WizardSessionData>) => {
  const state = ctx.wizard.state as IStateData;
  const filename = state.userId + state.username;

  try {
    const link = await ctx.telegram.getFileLink(state.voice.file_id);
    const oggPath = await ogg.create(link.href, filename);
    const mp3Path = await ogg.toMP3(oggPath, filename);
    const text = await openai.transcription(mp3Path);
    return text;
  } catch (err) {
    console.error('Error voiceHandle ', err);
  }
};

export const searchHandler = async (ctx: Scenes.WizardContext<Scenes.WizardSessionData>, msg: string | Voice) => {
  const state = ctx.wizard.state as IStateData;
  state.username = ctx.from?.username || '';
  state.userId = String(ctx.from?.id);

  if (msg) {
    const waitMsg = await ctx.reply(code(searchWaitMsg));

    if (typeof msg === 'string') {
      state.search = msg;
    } else {
      state.voice = msg;
      state.search = (await voiceHandle(ctx)) || ' ';
    }

    const content = state.search;
    if (state.messages && state.messages.length > 0) {
      state.messages.push({ role: 'user', content });
    } else {
      state.messages = [{ role: 'user', content }];
    }

    const result = (await openai.chat(state.messages)) || ' ';
    const requestContent = typeof result !== 'string' ? result.content : ' ';
    state.messages.push({ role: 'assistant', content: requestContent });

    await ctx.deleteMessage(waitMsg.message_id);
    if (state.voice) await ctx.reply(`Your request: \n\n${content}`);
    return ctx.reply(requestContent);
  }

  ctx.replyWithHTML(invalidSearchRequestMsg);
  return ctx.scene.leave();
};
