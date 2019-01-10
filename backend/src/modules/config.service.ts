import { Injectable } from '@nestjs/common'

export interface EnvConfig {
  [key: string]: string;
}

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor() {
    this.envConfig = process.env
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}