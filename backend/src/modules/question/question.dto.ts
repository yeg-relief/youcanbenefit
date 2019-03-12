export class QuestionDto {
    readonly text: string;
    readonly id: string;
    readonly type: string;

    constructor(data) {
        Object.assign(this, data);

        if (!this.hasOwnProperty('text') || !this.hasOwnProperty('id') || !this.hasOwnProperty('type')) {
            throw new Error("bad QuestionDto");
        }
    }
}