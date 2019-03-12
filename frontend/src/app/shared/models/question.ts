import { QuestionOption } from './question-option';

export interface ScreenerQuestion {
  type: 'boolean' | 'number' | 'text';
  value?: string | number | boolean;
  label: string;
  expandable: boolean;
  conditonalQuestions?: ScreenerQuestion[];
  options?: QuestionOption[];
  id: string;
  index: number;
  controlType: 'radio' | 'input';
}
