import { ChatCompletionRequestMessage } from 'openai';
import { Scenes } from 'telegraf';
import { Message, Voice } from 'telegraf/typings/core/types/typegram';

export interface IStateData {
  search: string;
  voice: Voice;
  userId: string;
  username: string;
  messages: ChatCompletionRequestMessage[];
}

export interface IBackToStepData {
  ctx: Scenes.WizardContext<Scenes.WizardSessionData>;
  indexStep: number;
  value: string | number;
  handle: (ctx: Scenes.WizardContext<Scenes.WizardSessionData>, value: string | number) => Promise<Message.TextMessage>;
}

export interface ReplyMarkup {
  reply_markup: {
    inline_keyboard: { text: string; callback_data: string }[][];
    resize_keyboard?: boolean;
  };
}

export type Command = { text: string; callback_data: string };
export type Commands = Command[][];
