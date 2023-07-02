import { Module } from '@nestjs/common';
import { EnglishClassCommand } from './english-class.command';
import { TaskModule } from '../task/task.module';
import { SurveyQuestions } from './survey.questions';
import { TelegaModule } from '../telega/telega.module';

@Module({
  imports: [TaskModule, TelegaModule],
  providers: [EnglishClassCommand, SurveyQuestions],
  exports: [EnglishClassCommand],
})
export class EnglishClassModule {}
