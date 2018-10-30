interface Key {
    name: string;
    type: string;
}

interface Condition {
    key: Key;
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

    getKeyName() {
        if (this.isRange()) {
            return this.getPropName(this.data.range);
        } else if (this.isTerm()) {
            return this.getPropName(this.data.term);
        }
    }

    getKeyType() {
        if (this.isRange()) {
            return "number"
        } else if (this.isTerm()) {
            return typeof this.data.term[this.getKeyName()]
        }
    }

    getKeyValue() {
        if (this.isRange()) {
            const _condition = this.data.range[this.getKeyName()];
            const qualifier = this.getPropName(_condition);
            return _condition[qualifier];
        } else if (this.isTerm()) {
            return this.data.term[this.getKeyName()]
        }
    }

    getEsQualifier() {
        if (!this.isRange()) return null;

        const keyName = this.getKeyName();
        const qualifierObj = this.data.range[keyName];
        return this.getPropName(qualifierObj);
    }

    getApplicationQualifier() {
        return this.nameMap[this.getEsQualifier()]
    }

    toApplicationModel(): Condition {
        const key = {
            name: this.getKeyName(),
            type: this.getKeyType()
        };

        const value = this.getKeyValue();
        let qualifier = this.isRange() ? this.getApplicationQualifier() : "equal";

        return {
            key,
            value,
            qualifier
        }
    }
}