import 'winston-daily-rotate-file';
import { format, transports } from 'winston';
import * as path from 'path';
import { WinstonModule } from 'nest-winston';

const options = {
  combined: {
    filename: path.resolve(
      __dirname,
      '..',
      '..',
      'logs',
      '%DATE%-combined.log',
    ),
    handleExceptions: true,
    maxsize: 5242880, // 5MB
    datePattern: 'YYYY-MM-DD',
    maxFiles: 20,
    timestamp: true,
    format: format.combine(format.timestamp(), format.json()),
  },
  console: {
    timestamp: true,
    format: format.combine(
      format.timestamp(),
      format.colorize(),
      format.cli(),
      format.printf(
        (msg) =>
          `${msg.timestamp.replace(/[T,Z]/g, ' ')}| ${msg.level} > ${
            msg.message
          }`,
      ),
    ),
  },
};

const log = WinstonModule.createLogger({
  transports: [
    new transports.DailyRotateFile(options.combined),
    new transports.Console(options.console),
  ],
});

export { log };
