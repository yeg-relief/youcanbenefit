export class DocumentDto {
    created: number;
    title: string;
    content: string;

    constructor(data) {
        Object.assign(this, data);

        if (!this.hasOwnProperty('created') || typeof this.created !== "number") {
            throw new Error("bad DocumentDto");
        }
    }
}