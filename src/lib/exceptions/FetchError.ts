export class FetchError extends Error {
    response: Response;

    constructor(message: string, response: Response) {
        super(message);
        this.name = "FetchError";
        this.response = response;
    }
}