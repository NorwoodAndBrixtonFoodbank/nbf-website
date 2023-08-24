export class FetchError extends Error {
    constructor(faultyArea = "the data") {
        super(`We could not fetch ${faultyArea} at this time. Please try again later.`);
        this.name = "FetchError";
    }
}

export class DatabaseError extends Error {
    constructor(faultyArea = "") {
        super(
            `We could not process the request ${faultyArea} at this time. Please try again later.`
        );
        this.name = "DatabaseError";
    }
}
