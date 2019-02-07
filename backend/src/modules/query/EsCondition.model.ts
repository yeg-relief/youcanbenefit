interface QuestionKey {
    text: string;
    id: string;
    type: string;
}

interface Condition {
    questionKey: QuestionKey;
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

    constructor(private data: esQuery) {}

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

    getQuestionKeyId() {
        if (this.isRange()) {
            return this.getPropName(this.data.range);
        } else if (this.isTerm()) {
            return this.getPropName(this.data.term);
        }
    }

    getQuestionKeyType() {
        if (this.isRange()) {
            return "number"
        } else if (this.isTerm()) {
            return typeof this.data.term[this.getQuestionKeyId()]
        }
    }

    getQuestionKeyValue() {
        if (this.isRange()) {
            const _condition = this.data.range[this.getQuestionKeyId()];
            const qualifier = this.getPropName(_condition);
            return _condition[qualifier];
        } else if (this.isTerm()) {
            return this.data.term[this.getQuestionKeyId()]
        }
    }

    getEsQualifier() {
        if (!this.isRange()) return null;

        const keyId= this.getQuestionKeyId();
        const qualifierObj = this.data.range[keyId];
        return this.getPropName(qualifierObj);
    }

    getApplicationQualifier() {
        return this.nameMap[this.getEsQualifier()]
    }

    toApplicationModel(): Condition {
        const questionKey = {
            text: 'TEST',
            id: this.getQuestionKeyId(),
            type: this.getQuestionKeyType()
        };

        const value = this.getQuestionKeyValue();
        let qualifier = this.isRange() ? this.getApplicationQualifier() : "equal";

        return {
            questionKey,
            value,
            qualifier
        }
    }
}