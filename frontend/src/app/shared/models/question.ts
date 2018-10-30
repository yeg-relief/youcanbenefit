import { QuestionOption } from './question-option';

export interface Question {
  type: 'boolean' | 'number' | 'text';
  value?: string | number | boolean;
  label: string;
  expandable: boolean;
  conditonalQuestions?: Question[];
  options?: QuestionOption[];
  key: string;
  id: string;
  index: number;
  controlType: 'radio' | 'input';
}
