import { BatchActionType } from "@/app/batch-create/types";
import { Dispatch } from "react";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import styled from "styled-components";

interface RowIdComponentProps {
    rowId: number;
    dispatch: Dispatch<BatchActionType>;
}

const RowIdDisplay = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    > button {
        color: ${(props) => props.theme.text};
        min-width: 0;
        width: 40px;
    }
`;

const Spacer = styled.span`
    width: 40px;
`;

const RowIdComponent = ({ rowId, dispatch }: RowIdComponentProps): React.ReactElement => {
    const deleteRow = (): void => {
        dispatch({
            type: "delete_row",
            deleteRowPayload: {
                rowId,
            },
        });
    };
    return (
        <RowIdDisplay>
            <Button onClick={deleteRow}>
                <DeleteIcon fontSize="small" />
            </Button>
            <span>{rowId}</span>
            <Spacer />
        </RowIdDisplay>
    );
};

export default RowIdComponent;
