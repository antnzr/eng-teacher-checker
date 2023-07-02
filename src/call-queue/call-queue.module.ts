import { Module, Provider } from '@nestjs/common';
import {
  CALL_QUEUE,
  LEVEL_ENG_INTERVAL,
  LEVEL_ENG_INTERVAL_CAP,
} from '../constants';
import { importDynamic } from '../core/util';

import type Queue from 'p-queue';
export type CallQueue = Queue;

const queueProvider: Provider = {
  provide: CALL_QUEUE,
  useFactory: async () => {
    const { default: Queue } = await importDynamic('p-queue');
    return new Queue({
      intervalCap: LEVEL_ENG_INTERVAL_CAP,
      interval: LEVEL_ENG_INTERVAL,
    });
  },
};

/**
 * The module is a queue that allows to call an api with
 * a particular amount of requests per particular amount of time
 */
@Module({
  providers: [queueProvider],
  exports: [queueProvider],
})
export class CallQueueModule {}
