import { GridEditCellProps, GridPreProcessEditCellProps } from "@mui/x-data-grid";
import { phoneNumberRegex } from "@/common/format";

export const phoneNumberValidation = (params: GridPreProcessEditCellProps): GridEditCellProps => {
    const unformattedInput = params.props.value.replaceAll(/[\s-()]/g, "");
    const hasError = unformattedInput.match(phoneNumberRegex) === null;
    return {
        ...params.props,
        error: hasError,
    };
};
