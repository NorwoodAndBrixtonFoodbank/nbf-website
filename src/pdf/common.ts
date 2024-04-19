export type PdfDataFetchResponse<Data, ErrorType extends string> =
    | {
          data: { pdfData: Data; fileName: string };
          error: null;
      }
    | { data: null; error: { type: ErrorType; logId: string } };
