import { Question, QuestionSet } from 'nest-commander';
import { API_CALL_INTERVAL, Questions, TEACHERS } from '../constants';
import { getDates } from '../core/util';

@QuestionSet({ name: Questions.SURVEY })
export class SurveyQuestions {
  @Question({
    type: 'list',
    name: 'interval',
    choices: [
      {
        name: 'Every 3 minutes',
        value: API_CALL_INTERVAL.EVERY_3_MINUTES,
      },
      {
        name: 'Every 5 minutes (default)',
        value: API_CALL_INTERVAL.EVERY_5_MINUTES,
      },
      {
        name: 'Every 10 minutes',
        value: API_CALL_INTERVAL.EVERY_10_MINUTES,
      },
      {
        name: 'Every 15 minutes',
        value: API_CALL_INTERVAL.EVERY_15_MINUTES,
      },
      {
        name: 'Every 20 minutes',
        value: API_CALL_INTERVAL.EVERY_20_MINUTES,
      },
    ],
    default: API_CALL_INTERVAL.EVERY_5_MINUTES,
    message: 'Choose an interval to check',
  })
  parseInterval(val: string) {
    return val;
  }

  @Question({
    type: 'list',
    name: 'teacher',
    choices: TEACHERS,
    message: 'Choose a teacher',
  })
  parseTeacher(val: string) {
    return val;
  }

  @Question({
    type: 'checkbox',
    name: 'dates',
    message: 'Choose the dates',
    loop: false,
    choices: getDates(),
    validate(input: string[] | null) {
      return (input?.length > 0 && input?.length < 6) || 'Min 1, max 5';
    },
  })
  parseDates(val: string[]) {
    return val;
  }
}
