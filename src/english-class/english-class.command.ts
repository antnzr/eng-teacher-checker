import { Logger } from '@nestjs/common';
import { Command, CommandRunner, Option } from 'nest-commander';
import { TEACHERS } from '../constants';
import { getDates, importDynamic } from '../core/util';

interface EngClassCommandOptions {
  notify?: boolean;
}

@Command({
  name: 'check-teacher',
  aliases: ['chte'],
  description: 'Check if teacher is available',
})
export class EnglishClassCommand extends CommandRunner {
  private readonly logger = new Logger(EnglishClassCommand.name);

  async run(params: string[], options?: EngClassCommandOptions): Promise<void> {
    const { notify } = options;
    if (notify !== undefined && notify !== null) {
      this.logger.warn(options.notify);
    }

    try {
      const inquirer = await importDynamic('inquirer');
      const answers = await inquirer.default.prompt([
        {
          type: 'list',
          name: 'teacher',
          choices: TEACHERS,
          message: 'Choose a teacher',
        },
        {
          type: 'checkbox',
          name: 'dates',
          choices: getDates(),
          message: 'Choose dates',
        },
      ]);
    } catch (error) {
      this.logger.error(error.message);
    }
  }

  @Option({
    flags: '-n, --notify [boolean]',
    description: 'Send notification to telegram',
  })
  isNotify(val: string): boolean {
    return JSON.parse(val);
  }
}
