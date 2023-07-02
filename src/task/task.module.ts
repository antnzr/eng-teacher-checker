import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { LevelEngModule } from '../level-eng/level-eng.module';
import { CallQueueModule } from '../call-queue/call-queue.module';

@Module({
  imports: [LevelEngModule, CallQueueModule],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
