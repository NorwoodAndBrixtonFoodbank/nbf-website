export class FetchError extends Error {
    constructor(faultyArea = "the data") {
        super(`We could not fetch ${faultyArea} at this time. Please try again later.`);
        this.name = "FetchError";
    }
}

export class RequestError extends Error {
    constructor() {
        super("We could not process the request at this time. Please try again later.");
        this.name = "RequestError";
    }
}
