import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configValidationSchema } from './core/config.schema';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: configValidationSchema,
      isGlobal: true,
    }),
    TaskModule,
  ],
  providers: [],
})
export class AppModule {}
