import { createReadStream } from 'fs';

import { ChatCompletionRequestMessage, ChatCompletionResponseMessage, Configuration, OpenAIApi } from 'openai';

import { IConfigService } from '../config/config.interface';
import { ConfigService } from '../config/config.service';
import { removeFile } from '../utils/removeFile';

const config: IConfigService = new ConfigService();

class OpenAI {
  private readonly openai: OpenAIApi;

  constructor() {
    const configuration = new Configuration({
      apiKey: config.get('OPENAI_API_KEY')
    });
    this.openai = new OpenAIApi(configuration);
  }

  async chat(messages: ChatCompletionRequestMessage[]): Promise<ChatCompletionResponseMessage | string | undefined> {
    try {
      const { data } = await this.openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        temperature: 0.2,
        messages
      });
      return data.choices[0].message;
    } catch (err) {
      console.error('Error OpenAI transcription ', err);
      return JSON.stringify(err.message, null, 2);
    }
  }

  async transcription(filepath: string): Promise<string> {
    try {
      const file = createReadStream(filepath);
      //@ts-ignore
      const { data } = await this.openai.createTranscription(file, 'whisper-1');
      await removeFile(filepath);
      return data.text;
    } catch (err) {
      console.error('Error OpenAI transcription ', err);
      return JSON.stringify(err.message, null, 2);
    }
  }
}

export const openai = new OpenAI();
