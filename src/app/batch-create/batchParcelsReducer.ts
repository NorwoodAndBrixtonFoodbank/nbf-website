import {
    BatchTableDataState,
    BatchActionType,
    BatchClient,
    clientOverrideCellValueType,
    parcelOverrideCellValueType,
    ParcelData,
    OverrideDataRow,
    BatchDataRow,
} from "@/app/batch-create/batchTypes";
import {
    getOverridenFieldsAndValues,
    getRowToBeUpdated,
} from "@/app/batch-create/clientSideReducerHelpers";
import { getEmptyBatchEditData } from "@/app/batch-create/emptyData";

export const batchParcelsReducer = (
    state: BatchTableDataState,
    action: BatchActionType
): BatchTableDataState => {
    switch (action.type) {
        case "initialise_table_state": {
            return action.payload.initialTableState;
        }
        case "update_cell": {
            const { rowId, newValueAndFieldName } = action.updateCellPayload;
            const rowToUpdate = getRowToBeUpdated(rowId, state);
            if (!rowToUpdate) {
                return state;
            }
            if (newValueAndFieldName.type == "client") {
                rowToUpdate.data.client[newValueAndFieldName.fieldName] =
                    newValueAndFieldName.newValue;
            } else if (newValueAndFieldName.type == "parcel" && rowToUpdate.data.parcel) {
                rowToUpdate.data.parcel[newValueAndFieldName.fieldName] =
                    newValueAndFieldName.newValue;
            } else {
                return state;
            }
            return rowId === 0
                ? {
                      ...state,
                      overrideDataRow: rowToUpdate as OverrideDataRow,
                  }
                : {
                      ...state,
                      batchDataRows: state.batchDataRows.map((row) =>
                          row.id === rowId ? rowToUpdate : row
                      ) as BatchDataRow[],
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
                              data: getEmptyBatchEditData(),
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
            ) as { field: keyof ParcelData; value: parcelOverrideCellValueType }[];
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
