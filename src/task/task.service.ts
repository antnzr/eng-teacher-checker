import { Inject, Injectable, Logger } from '@nestjs/common';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CALL_QUEUE, DEFAULT_TIMEZONE, TASK, TELEGRAM } from '../constants';
import { CheckTeacherDto } from './dto';
import { CronJob } from 'cron';
import { LevelEngService } from '../level-eng/level-eng.service';
import { CallQueue } from '../call-queue/call-queue.module';
import { gray, greenBright } from 'colorette';
import { Bot } from 'grammy';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);
  private readonly telegramChatId: string | null;

  constructor(
    @Inject(CALL_QUEUE) private readonly queue: CallQueue,
    @Inject(TELEGRAM) private readonly telegram: Bot,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly levelEngService: LevelEngService,
    private readonly config: ConfigService,
  ) {
    this.telegramChatId = this.config.get<string | null>(
      'TELEGRAM_CHAT_ID',
      null,
    );
  }

  checkIfTeacherAvailableJob(dto: CheckTeacherDto): void {
    const job = new CronJob(
      CronExpression.EVERY_5_MINUTES,
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

  private checkIfCanNotify(isNotify?: boolean): Promise<void> {
    if (!isNotify) return;
    if (this.telegramChatId) return;
    this.logger.log(
      gray('No telegram chat id is provided. No message will be sent'),
    );
  }

  private async checkIfTeacherAvailable(dto: CheckTeacherDto): Promise<void> {
    const { teacher, dates, notify } = dto;
    this.checkIfCanNotify(notify);

    for await (const date of dates) {
      await this.queue.add(
        async (): Promise<void> =>
          await this.handleTeacher(teacher, date, notify),
      );
    }
  }

  private async handleTeacher(
    teacher: string,
    date: string,
    isNotify: boolean,
  ): Promise<void> {
    const result = await this.levelEngService.getAvailableSlots({
      teacher,
      date,
    });

    if (!result) return this.logUnavailable(teacher, date);
    this.handleTeacherAvailable(teacher, date, result.time, isNotify);
  }

  private async handleTeacherAvailable(
    teacher: string,
    date: string,
    time: string[],
    isNotify?: boolean,
  ): Promise<void> {
    this.logAvailable(teacher, date, time);
    isNotify && (await this.sendNotification(teacher, date, time));
  }

  private async sendNotification(
    teacher: string,
    date: string,
    time: string[],
  ): Promise<void> {
    try {
      this.telegramChatId &&
        (await this.telegram.api.sendMessage(
          this.telegramChatId,
          `Teacher ${teacher} is available ${date} at\n${time.join('\n')}`,
        ));
    } catch (error) {
      this.logger.error(`Failed send telegram msg. Error: ${error.message}`);
    }
  }

  private logAvailable(teacher: string, date: string, time: string[]): void {
    this.logger.log(
      `Teacher ${greenBright(teacher)} is available ${greenBright(
        date,
      )} at ${time.map((t: string) => greenBright(t)).join(', ')}`,
    );
  }

  private logUnavailable(teacher: string, date: string): void {
    this.logger.log(gray(`Teacher ${teacher} unavailble ${date}`));
  }
}
