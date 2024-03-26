export class DatabaseError extends Error {
    constructor(errorCategory: DatabaseOperation, faultyArea = "", logId: string) {
        super(
            `An error occurred completing the ${errorCategory} operation` +
                (faultyArea !== "" ? ` (${faultyArea})` : "") +
                ". Please try again." +
                `Log ID: ${logId}`
        );
        this.name = "DatabaseError";
    }
}

export class AbortError extends Error {
    constructor(errorCategory: DatabaseOperation, faultyArea = "", logId: string) {
        super(
            `The following request was aborted: the ${errorCategory} operation` +
                (faultyArea !== "" ? ` (${faultyArea})` : "") +
                `Log ID: ${logId}`
        );
        this.name = "AbortError";
    }
}

type DatabaseOperation = "fetch" | "insert" | "update" | "delete";

export class EdgeFunctionError extends Error {
    constructor(functionDescriptor = "", logId: string) {
        super(
            "An error occurred executing an internal operation (" +
                functionDescriptor +
                ")" +
                `Log ID: ${logId}`
        );
        this.name = "EdgeFunctionError";
    }
}
