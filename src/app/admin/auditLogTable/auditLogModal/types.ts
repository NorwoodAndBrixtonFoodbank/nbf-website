export type ForeignResponse<ForeignData, ForeignError> =
    | {
          data: ForeignData;
          error: null;
      }
    | {
          data: null;
          error: ForeignError;
      };
