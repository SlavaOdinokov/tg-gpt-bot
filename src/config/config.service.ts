import { DotenvParseOutput, config } from 'dotenv';
import { IConfigService } from './config.interface';

export class ConfigService implements IConfigService {
  private config: DotenvParseOutput;

  constructor() {
    const { error, parsed } = config();
    if (error) throw new Error('.env file not found');
    if (!parsed) throw new Error('.env empty file');
    this.config = parsed;
  }

  get(key: string): string {
    const value = this.config[key];
    if (!value) throw new Error('There is no such key in .env');
    return value;
  }
}
