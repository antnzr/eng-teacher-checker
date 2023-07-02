import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { LevelEngModule } from '../level-eng/level-eng.module';
import { CallQueueModule } from '../call-queue/call-queue.module';
import { TelegaModule } from '../telega/telega.module';

@Module({
  imports: [LevelEngModule, CallQueueModule, TelegaModule],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
