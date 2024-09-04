import { Button } from "@mui/material";
import React, { useCallback, useState } from "react";
import { AddBatchRowError } from "@/app/batch-create/helpers/submitTableData";
import { defaultTableState } from "@/app/batch-create/BatchParcelDataGrid";
import { BatchActionType, BatchTableDataState } from "@/app/batch-create/types";
import styled from "styled-components";
import SubmitDataButton from "@/app/batch-create/actionButtonComponents/SubmitData";
import ResetTableButton from "@/app/batch-create/actionButtonComponents/ResetTable";

interface BatchCreateActionsProps {
    tableState: BatchTableDataState;
    dispatch: React.Dispatch<BatchActionType>;
}

const ButtonsGroup = styled.div`
    display: flex;
    justify-content: left;
    gap: 1rem;
    margin: 1rem;
`;

const ActionButtons = ({ tableState, dispatch }: BatchCreateActionsProps): React.ReactElement => {
    const [confirmationErrors, setConfirmationErrors] = useState<AddBatchRowError[]>([]);
    const [submitErrors, setSubmitErrors] = useState<AddBatchRowError[]>([]);

    const resetTable = useCallback((): void => {
        setConfirmationErrors([]);
        setSubmitErrors([]);
        dispatch({
            type: "initialise_table_state",
            payload: { initialTableState: defaultTableState },
        });
    }, [dispatch, setConfirmationErrors, setSubmitErrors]);

    return (
        <ButtonsGroup>
            <SubmitDataButton
                dispatch={dispatch}
                tableState={tableState}
                resetTable={resetTable}
                confirmationErrors={confirmationErrors}
                setConfirmationErrors={setConfirmationErrors}
                submitErrors={submitErrors}
                setSubmitErrors={setSubmitErrors}
            />
            <Button onClick={() => dispatch({ type: "add_row" })} variant="contained">
                + Add new row
            </Button>

            <ResetTableButton resetTable={resetTable} />
        </ButtonsGroup>
    );
};

export default ActionButtons;
