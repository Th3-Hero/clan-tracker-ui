import { FetchError } from "./FetchError";
import type { ProblemDetail } from "./ProblemDetail";

export class DetailedFetchError extends FetchError {
    problemDetail: ProblemDetail;

    constructor(message: string, response: Response, problemDetail: ProblemDetail) {
        super(message, response);
        this.name = "DetailedFetchError";
        this.problemDetail = problemDetail;
    }
}