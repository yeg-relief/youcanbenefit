export class ScreenerDto {
    created: number;
    constructor(readonly questions: any[]) {
        this.created = Date.now();
    }
}