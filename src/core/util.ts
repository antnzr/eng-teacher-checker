import { DEFAULT_DATES_LENGTH } from '../constants';

export const getDates = (len: number = DEFAULT_DATES_LENGTH): string[] =>
  Array.from(Array(len).keys()).map((idx: number) => {
    const d = new Date();
    d.setDate(d.getDate() + idx);
    return d.toISOString().split('T')[0];
  });

export const importDynamic = new Function(
  'modulePath',
  'return import(modulePath)',
);

export const sleep = (ms: number): Promise<unknown> =>
  new Promise((r) => setTimeout(r, ms));

export const justHangingAround = async (): Promise<unknown> =>
  await sleep(24 * 60 * 60 * 1000);
