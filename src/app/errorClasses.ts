export class DatabaseError extends Error {
    constructor(errorCategory: DatabaseOperation, faultyArea = "", errorId: string) {
        super(
            `An error occurred completing the ${errorCategory} operation` +
                (faultyArea !== "" ? ` (${faultyArea})` : "") +
                ". Please try again." +
                `Error ID: ${errorId}`
        );
        this.name = "DatabaseError";
    }
}

type DatabaseOperation = "fetch" | "insert" | "update" | "delete";

export class EdgeFunctionError extends Error {
    constructor(functionDescriptor = "") {
        super("An error occurred executing an internal operation (" + functionDescriptor + ")");
        this.name = "EdgeFunctionError";
    }
}
