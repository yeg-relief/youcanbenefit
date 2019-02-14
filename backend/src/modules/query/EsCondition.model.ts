import { QuestionDto } from '../question/question.dto';

interface Condition {
    question: QuestionDto;
    value: number | boolean;
    qualifier?: string;
}

export interface esQuery {
    range?: {[key: string]: Object}
    term?:  {[key: string]: string | number}
}

export class EsConditionModel {
    nameMap = {
        "lte": "lessThanOrEqual",
        "lt": "lessThan",
        "eq": "equal",
        "gt": "greaterThan",
        "gte": "greaterThanOrEqual"
    };

    constructor(private data: esQuery, private questionTexts: any) {}

    isRange() {
        return typeof this.data.range !== "undefined"
    }

    isTerm() {
        return typeof this.data.term !== "undefined"
    }


    getPropName(obj) {
        const [first, ...rest] = Object.keys(obj);
        return first;
    }

    getQuestionText(): string {
        let id = this.getQuestionId()
        if (this.questionTexts.hasOwnProperty(id)) {
            return this.questionTexts[id]
        } else {
            return ""
        }
    }

    getQuestionId() {
        if (this.isRange()) {
            return this.getPropName(this.data.range);
        } else if (this.isTerm()) {
            return this.getPropName(this.data.term);
        }
    }

    getQuestionType() {
        if (this.isRange()) {
            return "number"
        } else if (this.isTerm()) {
            return typeof this.data.term[this.getQuestionId()]
        }
    }

    getQuestionValue() {
        if (this.isRange()) {
            const _condition = this.data.range[this.getQuestionId()];
            const qualifier = this.getPropName(_condition);
            return _condition[qualifier];
        } else if (this.isTerm()) {
            return this.data.term[this.getQuestionId()]
        }
    }

    getEsQualifier() {
        if (!this.isRange()) return null;

        const questionId= this.getQuestionId();
        const qualifierObj = this.data.range[questionId];
        return this.getPropName(qualifierObj);
    }

    getApplicationQualifier() {
        return this.nameMap[this.getEsQualifier()]
    }

    toApplicationModel(): Condition {
        const question = {
            text: this.getQuestionText(),
            id: this.getQuestionId(),
            type: this.getQuestionType()
        };

        const value = this.getQuestionValue();
        let qualifier = this.isRange() ? this.getApplicationQualifier() : "equal";

        return {
            question,
            value,
            qualifier
        }
    }
}