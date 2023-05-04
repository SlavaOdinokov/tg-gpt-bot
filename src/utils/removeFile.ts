import { unlink } from 'fs/promises';

export const removeFile = async (filepath: string) => {
  try {
    await unlink(filepath);
  } catch (err) {
    console.error('Error OggConverter toMP3 ', err);
  }
};
