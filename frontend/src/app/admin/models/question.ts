export interface Question {
    text: string;
    id: string;
    type: 'boolean' | 'integer' | 'number' | 'invalid' | '';
}