import {
    BatchTableDataState,
    BatchActionType,
    BatchClient,
    clientOverrideCellValueType,
    parcelOverrideCellValueType,
    BatchParcel,
} from "@/app/parcels/batch/BatchTypes";
import { getOverridenFieldsAndValues } from "@/app/parcels/batch/clientSideReducerHelpers";

export const batchParcelsReducer = (
    state: BatchTableDataState,
    action: BatchActionType
): BatchTableDataState => {
    switch (action.type) {
        case "update_cell": {
            const { rowId, fieldNameClient, fieldNameParcel, newClientValue, newParcelValue } =
                action.updateCellPayload;
            const rowToUpdate = state.batchDataRows.find((row) => row.id === rowId);
            if (!rowToUpdate || !rowToUpdate.data) {
                return state;
            }
            //checks for !== undefined because newClientValue/newParcelValue can be null
            if (fieldNameClient && newClientValue !== undefined) {
                rowToUpdate.data.client[fieldNameClient] = newClientValue;
            } else if (fieldNameParcel && newParcelValue !== undefined && rowToUpdate.data.parcel) {
                rowToUpdate.data.parcel[fieldNameParcel] = newParcelValue;
            } else {
                return state;
            }
            return {
                ...state,
                batchDataRows: state.batchDataRows.map((row) =>
                    row.id === rowId ? rowToUpdate : row
                ),
            };
        }
        case "add_row": {
            const newId: number =
                Math.max(
                    ...state.batchDataRows.map((row) => {
                        return row.id;
                    })
                ) + 1;
            return state.batchDataRows.length < 99
                ? {
                      ...state,
                      batchDataRows: [
                          ...state.batchDataRows,
                          {
                              id: newId,
                              clientId: null,
                              data: null,
                          },
                      ],
                  }
                : state;
        }
        case "delete_row": {
            const { rowId } = action.deleteRowPayload;
            return rowId !== 0
                ? {
                      ...state,
                      batchDataRows: state.batchDataRows.filter((row) => row.id !== rowId),
                  }
                : state;
        }
        case "override_column": {
            const { newOverrideRow } = action.overrideColumnPayload;
            if (!newOverrideRow.data) {
                return state;
            }
            const overriddenClientFieldsAndValues = getOverridenFieldsAndValues(
                newOverrideRow.data.client
            ) as { field: keyof BatchClient; value: clientOverrideCellValueType }[];
            const overriddenParcelFieldsAndValues = getOverridenFieldsAndValues(
                newOverrideRow.data.parcel
            ) as { field: keyof BatchParcel; value: parcelOverrideCellValueType }[];
            return {
                ...state,
                clientOverrides: overriddenClientFieldsAndValues,
                parcelOverrides: overriddenParcelFieldsAndValues,
            };
        }
        case "remove_override_column": {
            const { clientField, parcelField } = action.removeOverrideColumnPayload;
            const updatedClientOverrides = state.clientOverrides.filter(
                (override) => override.field !== clientField
            );
            const updatedParcelOverrides = state.parcelOverrides.filter(
                (override) => override.field !== parcelField
            );
            return {
                ...state,
                clientOverrides: updatedClientOverrides,
                parcelOverrides: updatedParcelOverrides,
            };
        }
        case "remove_all_overrides": {
            return {
                ...state,
                clientOverrides: [],
                parcelOverrides: [],
            };
        }
        case "use_existing_client": {
            // const { rowId, existingClientId } = action.useExistingClientPayload;
            // const existingClientBatchData = await getClientDataForBatchParcels(existingClientId);
            // if (!existingClientBatchData) {
            //     return state;
            // }
            // const newRow: BatchDataRow = {
            //     id: rowId,
            //     clientId: existingClientId,
            //     data: {
            //         client: existingClientBatchData,
            //         clientReadOnly: true,
            //         parcel: null,
            //     },
            // };
            // const updatedRows: BatchDataRow[] = state.batchDataRows.map((row) => {
            //     return row.id === rowId ? newRow : row;
            // });
            // return {
            //     ...state,
            //     batchDataRows: updatedRows,
            // };
            throw Error("Not implemented"); // TODO
        }
        default: {
            return state;
        }
    }
};

export default batchParcelsReducer;
