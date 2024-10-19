export class ProblemDetail {
    type: string;
    title: string;
    status: number;
    detail: string;
    instance: string;

    constructor(type: string, title: string, status: number, detail: string, instance: string) {
        this.type = type;
        this.title = title;
        this.status = status;
        this.detail = detail;
        this.instance = instance;
    }
}