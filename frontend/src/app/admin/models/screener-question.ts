export type ID = string;
export type QuestionType = 'conditional' | 'constant';

export const QUESTION_TYPE_CONSTANT: QuestionType = 'constant';
export const QUESTION_TYPE_CONDITIONAL: QuestionType = 'conditional';

export type ControlType = '' | 'invalid' | 'NumberSelect' | 'NumberInput' | 'Toggle' | 'Multiselect';

export interface ScreenerQuestion {
    conditionalQuestions?: ID[],
    controlType: ControlType,
    expandable: boolean,
    id: ID,
    index: number,
    label: string,
    options: number[],
    multiSelectOptions: Array<any>
}

export interface MultiselectQuestion {
    id: ID;
    label: string;
    index: number;
}