export class ProgramDto {
    created: number;
    guid: string;
    readonly description: string;
    readonly details: string;
    readonly externalLink: string;
    readonly tags: string[];
    readonly title: string;

    constructor(data) {
        Object.assign(this, data);

        if (!this.hasOwnProperty('created') || typeof this.created !== "number") {
            throw new Error("bad ProgramDto");
        }
    }
}