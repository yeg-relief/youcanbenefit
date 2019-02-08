import { Question } from './question';

export interface Screener{
  conditionalQuestions: Question[]
  created: number,
  questions: Question[],
};