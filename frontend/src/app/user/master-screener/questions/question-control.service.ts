import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Question } from '../../../admin/models';

@Injectable()
export class QuestionControlService {
    constructor() { }

    toFormGroup(questions: Question[]): FormGroup {
        if (!questions || !Array.isArray(questions) ) {
            return new FormGroup({});
        }

        questions.sort( (a, b) => a.index - b.index);

        const group = questions.reduce((acc, question) => {
            if ( question.id && question.controlType === 'NumberInput') {
                acc[question.id] = new FormControl('', Validators.pattern('^\\d+$'));
            } else if (!question.id && question.controlType === 'Multiselect' && Array.isArray(question.multiSelectOptions)) {
                for (const selectQuestion of question.multiSelectOptions) {
                    acc[selectQuestion.key.name] = new FormControl('');
                }
            } else if(question.id ) {
                acc[question.id] = new FormControl('');
            }
            return acc;
        }, {});
        return new FormGroup(group);
    }

    addQuestions(questions: Question[], form: FormGroup) {
        let extractedQuestions = questions.reduce( (accumulator, question) => {
            let questions = [];
            if (question.controlType === 'Multiselect') {
                questions = question.multiSelectOptions;
            } else {
                questions = [question];
            }
            return [...accumulator, ...questions];
        }, []);



        extractedQuestions
            .filter(question => !form.contains(question.id))
            .forEach( question => form.addControl(question.id, new FormControl('')));
    }

    removeQuestions(questions: Question[], form: FormGroup) {
        let extractedQuestions = questions.reduce( (accumulator, question) => {
            let questions = [];
            if (question.controlType === 'Multiselect') {
                questions = question.multiSelectOptions;
            } else {
                questions = [question];
            }
            return [...accumulator, ...questions];
        }, []);

        extractedQuestions
            .filter(question => form.contains(question.id))
            .forEach(question => form.removeControl(question.id));
    }
}
