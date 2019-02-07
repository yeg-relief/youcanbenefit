interface QuestionKey {
    text: string,
    id: string,
    type: "boolean" | "number"
}

interface ApplicationCondition {
    questionKey: QuestionKey,
    value: boolean | number,
    qualifier: "lessThanOrEqual" | "lessThan" | "equal" | "greaterThan" | "greaterThanOrEqual"
}

export class ApplicationQueryDto {
    readonly guid: string;
    readonly id: string;
    readonly conditions: ApplicationCondition[];

    constructor(data) {
        Object.assign(this, data);

        if (!this.hasOwnProperty('conditions') || !Array.isArray(this.conditions)) {
            throw new Error("bad ApplicationQueryDto");
        }
    }
}