import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configValidationSchema } from './core/config.schema';
import { TaskModule } from './task/task.module';
import { EnglishClassModule } from './english-class/english-class.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      validationSchema: configValidationSchema,
      isGlobal: true,
    }),
    TaskModule,
    EnglishClassModule,
  ],
})
export class AppModule {}
