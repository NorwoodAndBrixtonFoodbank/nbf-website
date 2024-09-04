import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import React, { useCallback, useState } from "react";
import submitBatchTableData, {
    AddBatchRowError,
    filterUnsubmittedRows,
} from "@/app/batch-create/helpers/submitTableData";
import { useRouter } from "next/navigation";
import { BatchActionType, BatchTableDataState } from "@/app/batch-create/types";
import { verifyBatchTableDataSilent } from "@/app/batch-create/helpers/verifyTableData";
import styled from "styled-components";

interface ConfirmSubmissionDialogProps {
    isDialogVisible: boolean;
    setIsDialogVisible: React.Dispatch<React.SetStateAction<boolean>>;
    confirmationErrors: AddBatchRowError[];
    handleSubmit: () => void;
}

interface PostSubmissionDialogProps {
    message: string | null;
    closeDialog: () => void;
    submitErrors: AddBatchRowError[];
    resetTable: () => void;
}

interface SubmitDataButtonProps {
    resetTable: () => void;
    dispatch: React.Dispatch<BatchActionType>;
    tableState: BatchTableDataState;
    confirmationErrors: AddBatchRowError[];
    setConfirmationErrors: React.Dispatch<React.SetStateAction<AddBatchRowError[]>>;
    submitErrors: AddBatchRowError[];
    setSubmitErrors: React.Dispatch<React.SetStateAction<AddBatchRowError[]>>;
}

const StyledDialog = styled(Dialog)<{ $isError: boolean }>`
    & .MuiDialog-paper {
        padding: 1rem;
        border: 2px solid ${(props) => (props.$isError ? "#990f0f" : "#a8d49c")};
        border-radius: 15px;
    }
    & .MuiDialogActions-root {
        justify-content: center;
    }
`;

const countErrorTypes = (errors: AddBatchRowError[]): Record<string, number> => {
    const initialState: Record<string, number> = {};
    return errors.reduce((acc, rowError) => {
        acc[rowError.displayMessage] = (acc[rowError.displayMessage] ?? 0) + 1;
        return acc;
    }, initialState);
};

const SubmitDataButton = ({
    tableState,
    dispatch,
    resetTable,
    confirmationErrors,
    setConfirmationErrors,
    submitErrors,
    setSubmitErrors,
}: SubmitDataButtonProps) => {
    const [isConfirmationDialogVisible, setIsConfirmationDialogVisible] = useState(false);
    const [postSubmissionDialogMessage, setPostSubmissionDialogMessage] = useState<string | null>(
        null
    );
    const handleVerifyData = useCallback(
        (currentTableState: BatchTableDataState): void => {
            const confirmationErrors = verifyBatchTableDataSilent(currentTableState);
            setConfirmationErrors(confirmationErrors);
            setIsConfirmationDialogVisible(true);
        },
        [tableState, setConfirmationErrors, setIsConfirmationDialogVisible]
    );

    const handleSubmit = async (): Promise<void> => {
        const { submitErrors } = await submitBatchTableData(tableState);
        setSubmitErrors(submitErrors);

        if (submitErrors.length == 0) {
            setPostSubmissionDialogMessage("Successfully submitted");
            resetTable();
        } else {
            setPostSubmissionDialogMessage("Errors encountered during submission.");
            dispatch({
                type: "initialise_table_state",
                payload: { initialTableState: filterUnsubmittedRows(tableState, submitErrors) },
            });
        }

        setIsConfirmationDialogVisible(false);
    };

    return (
        <>
            <Button onClick={() => handleVerifyData(tableState)} variant="contained">
                Submit Data
            </Button>
            <ConfirmSubmissionDialog
                handleSubmit={handleSubmit}
                confirmationErrors={confirmationErrors}
                setIsDialogVisible={setIsConfirmationDialogVisible}
                isDialogVisible={isConfirmationDialogVisible}
            />
            <PostSubmissionDialog
                message={postSubmissionDialogMessage}
                closeDialog={() => setPostSubmissionDialogMessage(null)}
                submitErrors={submitErrors}
                resetTable={resetTable}
            />
        </>
    );
};

const ConfirmSubmissionDialog = ({
    isDialogVisible,
    setIsDialogVisible,
    confirmationErrors,
    handleSubmit,
}: ConfirmSubmissionDialogProps) => {
    const hasErrors = confirmationErrors.length > 0;
    const message = hasErrors
        ? "Errors were found, please fix before submission"
        : "Are you sure you want to submit?";

    return (
        <StyledDialog open={isDialogVisible} $isError={hasErrors}>
            <DialogTitle>{message}</DialogTitle>
            {hasErrors && (
                <DialogContent>
                    <ul>
                        {Object.entries(countErrorTypes(confirmationErrors)).map(
                            ([errorType, count]) => (
                                <li key={errorType}>
                                    {errorType}: {count} row(s)
                                </li>
                            )
                        )}
                    </ul>
                </DialogContent>
            )}
            <DialogActions>
                <Button
                    variant="contained"
                    onClick={() => {
                        setIsDialogVisible(false);
                    }}
                >
                    Close
                </Button>
                <Button variant="contained" onClick={handleSubmit} disabled={hasErrors}>
                    Submit
                </Button>
            </DialogActions>
        </StyledDialog>
    );
};

const PostSubmissionDialog = ({
    message,
    closeDialog,
    submitErrors,
    handleReset,
}: PostSubmissionDialogProps) => {
    const router = useRouter();
    const hasErrors = submitErrors.length > 0;
    return (
        <StyledDialog open={message !== null} $isError={hasErrors}>
            <DialogTitle>{message}</DialogTitle>
            {hasErrors && (
                <DialogContent>
                    An unexpected error occurred and some rows did not submit.
                    <br />
                    Please try submitting again.
                </DialogContent>
            )}
            <DialogActions>
                {hasErrors ? (
                    <>
                        <Button
                            variant="contained"
                            onClick={() => {
                                handleReset();
                                closeDialog();
                            }}
                        >
                            Reset rows and start again
                        </Button>
                        <Button variant="contained" onClick={closeDialog}>
                            View unsubmitted rows
                        </Button>
                    </>
                ) : (
                    <>
                        <Button variant="contained" onClick={closeDialog}>
                            Add more clients and parcels
                        </Button>
                        <Button variant="contained" onClick={() => router.push("/parcels")}>
                            Return to the Parcels Page
                        </Button>
                    </>
                )}
            </DialogActions>
        </StyledDialog>
    );
};

export default SubmitDataButton;
