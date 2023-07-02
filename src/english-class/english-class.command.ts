import { Inject, Logger } from '@nestjs/common';
import {
  Command,
  CommandRunner,
  InquirerService,
  Option,
} from 'nest-commander';
import { Questions, TELEGRAM } from '../constants';
import { justHangingAround } from '../core/util';
import { TaskService } from '../task/task.service';
import { Bot } from 'grammy';
import { gray } from 'colorette';

interface EngClassCommandOptions {
  notify?: boolean;
}

type Answers = {
  teacher: string;
  dates: string[];
};

@Command({
  name: 'check-teacher',
  aliases: ['chte'],
  description: 'Check if teacher is available',
})
export class EnglishClassCommand extends CommandRunner {
  private readonly logger = new Logger(EnglishClassCommand.name);

  constructor(
    @Inject(TELEGRAM) private readonly telegram: Bot,
    private readonly taskService: TaskService,
    private readonly inquirer: InquirerService,
  ) {
    super();
  }

  async run(params: string[], options?: EngClassCommandOptions): Promise<void> {
    try {
      console.clear();
      const { teacher, dates } = await this.inquirer.ask<Answers>(
        Questions.SURVEY,
        null,
      );

      const { notify } = options;
      this.taskService.checkIfTeacherAvailableJob({ teacher, dates, notify });
      if (notify) await this.launchTelegram();
      await justHangingAround();
    } catch (error) {
      this.logger.error(error);
    }
  }

  @Option({
    flags: '-n, --notify [boolean]',
    description: 'Send notification to telegram if teacher is available',
  })
  isNotify(val: string): boolean {
    try {
      return JSON.parse(val);
    } catch (error) {
      return false;
    }
  }

  private async launchTelegram(): Promise<void> {
    if (!this.telegram) {
      this.logger.log(
        gray('No telegram token is provided. No message will be sent'),
      );
      return;
    }

    try {
      await this.telegram.start();
    } catch (error) {
      this.logger.error(
        gray(`Failed to start telegram bot. Error: ${error.message}`),
      );
    }
  }
}
