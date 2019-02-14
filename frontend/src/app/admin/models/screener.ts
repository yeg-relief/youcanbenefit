import { ScreenerQuestion } from './screener-question';

export interface Screener{
  conditionalQuestions: ScreenerQuestion[]
  created: number,
  screenerQuestions: ScreenerQuestion[],
};