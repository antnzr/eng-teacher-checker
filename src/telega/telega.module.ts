import { Module, Provider } from '@nestjs/common';
import { TELEGRAM } from '../constants';
import { ConfigService } from '@nestjs/config';
import { Bot } from 'grammy';

const telegramProvider: Provider = {
  provide: TELEGRAM,
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => {
    const token = config.get<string | undefined>('TELEGRAM_BOT_TOKEN');
    if (!token) return null;
    return new Bot(token);
  },
};

@Module({
  providers: [telegramProvider],
  exports: [telegramProvider],
})
export class TelegaModule {}
