import { Inject, Injectable, Logger } from '@nestjs/common';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CALL_QUEUE, DEFAULT_TIMEZONE, TASK } from '../constants';
import { CheckTeacherDto } from './dto';
import { CronJob } from 'cron';
import { LevelEngService } from '../level-eng/level-eng.service';
import { CallQueue } from '../call-queue/call-queue.module';
import { gray, greenBright } from 'colorette';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly levelEngService: LevelEngService,
    @Inject(CALL_QUEUE) private readonly queue: CallQueue,
  ) {}

  checkIfTeacherAvailableJob(dto: CheckTeacherDto): void {
    const job = new CronJob(
      CronExpression.EVERY_MINUTE,
      async () => await this.checkIfTeacherAvailable(dto),
      null,
      false,
      DEFAULT_TIMEZONE,
      null,
      true,
    );

    this.schedulerRegistry.addCronJob(TASK.CHECK_IF_AVAILABLE_TEACHER, job);
    job.start();
  }

  private async checkIfTeacherAvailable(dto: CheckTeacherDto): Promise<void> {
    const { teacher, dates } = dto;
    for await (const date of dates) {
      await this.queue.add(
        async (): Promise<void> => await this.handleTeacher(teacher, date),
      );
    }
  }

  private async handleTeacher(teacher: string, date: string): Promise<void> {
    const result = await this.levelEngService.getAvailableSlots({
      teacher,
      date,
    });
    if (!result) return this.logUnavailable(teacher, date);
    this.logAvailable(teacher, date, result.time);
  }

  private logUnavailable(teacher: string, date: string): void {
    this.logger.log(gray(`Teacher ${teacher} unavailble ${date}`));
  }

  private logAvailable(teacher: string, date: string, time: string[]): void {
    this.logger.log(
      `Teacher ${greenBright(teacher)} is available ${greenBright(
        date,
      )} at ${time.map((t: string) => greenBright(t)).join(', ')}`,
    );
  }
}
