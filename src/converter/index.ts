import { createWriteStream } from 'fs';
import { resolve } from 'path';

import axios from 'axios';
import ffmpeg from 'fluent-ffmpeg';
import installer from '@ffmpeg-installer/ffmpeg';
import { removeFile } from '../utils/removeFile';

class OggConverter {
  constructor() {
    ffmpeg.setFfmpegPath(installer.path);
  }

  async toMP3(oggPath: string, filename: string): Promise<string> {
    try {
      const mp3Path = resolve(__dirname, '../../files', `${filename}.mp3`);

      return new Promise((res, rej) => {
        ffmpeg(oggPath)
          .inputOption('-t 30')
          .output(mp3Path)
          .on('end', () => {
            removeFile(oggPath);
            res(mp3Path);
          })
          .on('error', err => rej(err.message))
          .run();
      });
    } catch (err) {
      console.error('Error OggConverter toMP3 ', err);
      return JSON.stringify(err.message, null, 2);
    }
  }

  async create(url: string, filename: string): Promise<string> {
    try {
      const response = await axios({
        method: 'get',
        url,
        responseType: 'stream'
      });

      const oggPath = resolve(__dirname, '../../files', `${filename}.ogg`);

      return new Promise((res, rej) => {
        const stream = createWriteStream(oggPath);
        response.data.pipe(stream);
        stream.on('finish', () => res(oggPath));
      });
    } catch (err) {
      console.error('Error OggConverter create ', err);
      return JSON.stringify(err.message, null, 2);
    }
  }
}

export const ogg = new OggConverter();
