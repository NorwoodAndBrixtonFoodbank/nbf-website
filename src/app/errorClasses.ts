export class DatabaseError extends Error {
    constructor(errorCategory: DatabaseOperation, faultyArea = "") {
        super(
            `An error occurred completing the ${errorCategory} operation` +
                (faultyArea !== "" ? ` (${faultyArea})` : "") +
                ". Please try again."
        );
        this.name = "DatabaseError";
    }
}

type DatabaseOperation = "fetch" | "insert" | "update" | "delete";
