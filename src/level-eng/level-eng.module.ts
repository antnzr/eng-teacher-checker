import { Module } from '@nestjs/common';
import { LevelEngService } from './level-eng.service';
import { HttpModule } from '@nestjs/axios';
import { LEVEL_ENGLISH_URL } from '../constants';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        baseURL: LEVEL_ENGLISH_URL,
        headers: { 'Content-Type': 'application/json' },
      }),
    }),
  ],
  providers: [LevelEngService],
  exports: [LevelEngService],
})
export class LevelEngModule {}
