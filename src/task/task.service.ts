import { Injectable, Logger } from '@nestjs/common';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { DEFAULT_TIMEZONE, TASK } from '../constants';
import { CheckTeacherDto } from './dto';
import { CronJob } from 'cron';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(private readonly schedulerRegistry: SchedulerRegistry) {}

  checkIfTeacherAvailableJob(dto: CheckTeacherDto): void {
    const job = new CronJob(
      CronExpression.EVERY_MINUTE,
      async () => await this.checkIfTeacherAvailable(dto),
      null,
      true,
      DEFAULT_TIMEZONE,
    );

    this.schedulerRegistry.addCronJob(TASK.CHECK_IF_AVAILABLE_TEACHER, job);
    job.start();
  }

  private async checkIfTeacherAvailable(dto: CheckTeacherDto): Promise<void> {
    const { teacher, dates } = dto;
    for await (const date of dates) {
      this.logger.log(`date --> ${date}, teacher --> ${teacher}`);
    }
  }
}
