export class DatabaseError extends Error {
    constructor(errorCategory: DatabaseOperation, faultyArea = "") {
        super(
            `We could not ${errorCategory} the ${faultyArea} at this time. Please try again later.`
        );
        this.name = "DatabaseError";
    }
}

type DatabaseOperation = "fetch" | "insert" | "update" | "delete";
