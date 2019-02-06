export interface QuestionKey {
    text: string;
    id: string;
    type: 'boolean' | 'integer' | 'number' | 'invalid' | '';
  }