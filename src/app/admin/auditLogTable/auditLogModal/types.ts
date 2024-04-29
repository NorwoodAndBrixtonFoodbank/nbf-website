export type AuditLogModalRowResponse<Data, Error> =
    | {
          data: Data;
          error: null;
      }
    | {
          data: null;
          error: Error;
      };
