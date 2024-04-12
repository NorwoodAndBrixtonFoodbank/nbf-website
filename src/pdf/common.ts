export type PdfDataFetchResponse<DataType, ErrorType> = {
    data:
    {data: DataType;
    fileName: string;},
    error: null
} | {data: null, error: {type: ErrorType, logId: string}}
