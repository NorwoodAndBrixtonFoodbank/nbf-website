import { GridPreProcessEditCellProps } from "@mui/x-data-grid";
import { phoneNumberRegex, phoneNumberFormatSymbolsRegex } from "@/common/format";

export const isPhoneNumberValid = (params: GridPreProcessEditCellProps): boolean => {
    const unformattedInput = params.props.value.replaceAll(phoneNumberFormatSymbolsRegex, "");
    return unformattedInput.match(phoneNumberRegex) === null;
};
