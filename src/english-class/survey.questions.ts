import { Question, QuestionSet } from 'nest-commander';
import { Questions, TEACHERS } from '../constants';
import { getDates } from '../core/util';

@QuestionSet({ name: Questions.SURVEY })
export class SurveyQuestions {
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
    message: 'Choose dates.',
    choices: getDates(),
    validate(input: string[] | null): boolean {
      if (!input?.length || input?.length > 5) throw new Error('Min 1, max 5');
      return true;
    },
  })
  parseDates(val: string[]) {
    return val;
  }
}
