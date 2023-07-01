import { Module } from '@nestjs/common';
import { EnglishClassCommand } from './english-class.command';

@Module({
  providers: [EnglishClassCommand],
})
export class EnglishClassModule {}
