export type PdfDataFetchResponse<Data, ErrorType> =
    | {
          data: { data: Data; fileName: string };
          error: null;
      }
    | { data: null; error: { type: ErrorType; logId: string } };
