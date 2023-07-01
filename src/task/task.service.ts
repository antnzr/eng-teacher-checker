import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DEFAULT_TIMEZONE, TASK } from '../constants';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  @Cron(CronExpression.EVERY_MINUTE, {
    name: TASK.CHECK_IF_AVAILABLE_TEACHER,
    timeZone: DEFAULT_TIMEZONE,
  })
  async checkIfTeacherAvailable(dates: string[], teacher: string) {
    this.logger.debug('Called EVERY_MINUTE');
    for await (const date of dates) {
      this.logger.log(`date --> ${date}, teacher --> ${teacher}`);
    }
  }
}
