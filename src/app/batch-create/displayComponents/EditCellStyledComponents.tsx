import { GappedDiv } from "@/components/Form/formStyling";
import { MULTILINE_POPOVER_WIDTH, PERSON_WIDTH } from "@/app/batch-create/columnWidths";
import styled, { DefaultTheme } from "styled-components";
import { Button, TextField } from "@mui/material";

export const EditCellGappedDivMargin = styled(GappedDiv)<{ width: number }>(
    ({ width }) => `
    margin: 1rem;
    width: calc(${width}px - 2rem);
    overflow: clip;
    `
);

export const TopAddressFreeFormTextInput = styled(TextField)`
    margin-top: 0.5rem;
`;

export const EditCellTextField = styled(TextField)<{ width: number }>(
    ({ width }) => `
        width: ${width}px;
        padding: 0.5rem;
        .MuiInputBase-root {
            height: 2rem;
        }
    `
);

export const MultiLineTextField = styled(TextField)`
    width: ${MULTILINE_POPOVER_WIDTH}px;
`;

export const EditCellInputOptionButton = styled(Button)<{ width: number; theme: DefaultTheme }>(
    ({ width, theme }) => `
    width: ${width}px;
    color: ${theme.text};
    `
);

export const ClearButton = styled(Button)`
    margin: 0 0.5rem;
    margin-bottom: 0.5rem;
`;

export const EditCellInputLabel = styled.p`
    margin-top: 0.5rem;
    text-align: center;
`;

export const PersonInputDiv = styled.div`
    width: ${PERSON_WIDTH}px;
    display: flex;
    flex-direction: column;
    align-items: centre;
    justify-content: centre;
`;
export const BottomDiv = styled.div`
    margin-bottom: 0.5rem;
`;
export const EditCellButtonDiv = styled.div`
    display: flex;
    flex-direction: column;
`;

export const BooleanGroupCheckboxesDiv = styled.div<{ width: number }>(
    ({ width }) => `
        display: flex;
        flex-direction: column;
        width: ${width}px;
        overflow-vertical: scroll;
    `
);

export const BooleanGroupCheckBoxDiv = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;
