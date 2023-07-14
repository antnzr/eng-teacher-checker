import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { queueProvider } from '../call-queue/call-queue.module';
import { telegramProvider } from '../telega/telega.module';
import { ConfigModule } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { LevelEngService } from '../level-eng/level-eng.service';
import { CALL_QUEUE, TELEGRAM } from '../constants';
import { HttpModule } from '@nestjs/axios';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule],
      providers: [
        {
          provide: TELEGRAM,
          useValue: telegramProvider,
        },
        {
          provide: CALL_QUEUE,
          useValue: queueProvider,
        },
        TaskService,
        SchedulerRegistry,
        LevelEngService,
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
