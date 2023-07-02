import { Logger } from '@nestjs/common';
import {
  Command,
  CommandRunner,
  InquirerService,
  Option,
} from 'nest-commander';
import { Questions } from '../constants';
import { sleep } from '../core/util';
import { TaskService } from '../task/task.service';

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
    private readonly taskService: TaskService,
    private readonly inquirer: InquirerService,
  ) {
    super();
  }

  async run(params: string[], options?: EngClassCommandOptions): Promise<void> {
    try {
      const { notify } = options;
      if (notify !== undefined && notify !== null) {
        this.logger.warn(options.notify);
      }

      const { teacher, dates } = await this.inquirer.ask<Answers>(
        Questions.SURVEY,
        null,
      );

      this.taskService.checkIfTeacherAvailableJob({ teacher, dates });
      await sleep(24 * 60 * 60 * 1000); // preventing from exiting, maybe there is a better solution
    } catch (error) {
      this.logger.error(error.message);
    }
  }

  @Option({
    flags: '-n, --notify [boolean]',
    description: 'Send notification to telegram',
  })
  isNotify(val: string): boolean {
    try {
      return JSON.parse(val);
    } catch (error) {
      return false;
    }
  }
}
