import FreeFormTextInput from "@/components/DataInput/FreeFormTextInput";
import { CenterComponent, GappedDiv } from "@/components/Form/formStyling";
import { Button, Checkbox, FormControlLabel } from "@mui/material";
import { useState } from "react";
import { Address, BatchActionType, BatchTableDataState } from "@/app/parcels/batch/batchTypes";
import styled from "styled-components";
import { ADDRESS_WIDTH } from "@/app/parcels/batch/columnWidths";
import { postcodeRegex } from "@/app/clients/form/formSections/AddressCard";

const GappedDivMargin = styled(GappedDiv)`
    margin: 1rem;
    width: calc(${ADDRESS_WIDTH}px - 2rem);
    overflow: clip;
`;

const TopFreeFormTextInput = styled(FreeFormTextInput)`
    margin-top: 0.5rem;
`;

const getInitialAddressFields = (id: number, tableState: BatchTableDataState): Partial<Address> => {
    const currentRowAddress: Address | null =
        id === 0
            ? tableState.overrideDataRow.data.client.address
            : tableState.batchDataRows[id - 1].data.client.address;
    return {
        addressLine1: currentRowAddress?.addressLine1,
        addressLine2: currentRowAddress?.addressLine2 ?? undefined,
        addressTown: currentRowAddress?.addressTown,
        addressCounty: currentRowAddress?.addressCounty ?? undefined,
        addressPostcode: currentRowAddress?.addressPostcode,
    };
};

type AddressEditCellInputProps = {
    tableState: BatchTableDataState;
    id: number;
    dispatchBatchTableAction: React.Dispatch<BatchActionType>;
    simulateEscapeKeyPress: () => void;
};

const AddressEditCellInput: React.FC<AddressEditCellInputProps> = ({
    tableState,
    id,
    dispatchBatchTableAction,
    simulateEscapeKeyPress,
}) => {
    const [addressInputFields, setAddressInputFields] = useState<Partial<Address>>(
        getInitialAddressFields(id, tableState)
    );

    const [clientHasNoAddress, setClientHasNoAddress] = useState<boolean>(false);
    const [isPostcodeNotValid, setIsPostcodeNotValid] = useState<boolean>(false);
    const [isAddressLine1Empty, setIsAddressLine1Empty] = useState<boolean>(false);
    const [isAddressTownEmpty, setIsAddressTownEmpty] = useState<boolean>(false);

    const handleCheckCheckbox = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setClientHasNoAddress(event.target.checked);
    };

    const dispatchInputFieldData = (): void => {
        if (!clientHasNoAddress) {
            dispatchBatchTableAction({
                type: "update_cell",
                updateCellPayload: {
                    rowId: id,
                    newValueAndFieldName: {
                        type: "client",
                        fieldName: "address",
                        newValue: {
                            addressLine1: addressInputFields.addressLine1 ?? "",
                            addressLine2: addressInputFields.addressLine2 ?? null,
                            addressTown: addressInputFields.addressTown ?? "",
                            addressCounty: addressInputFields.addressCounty ?? null,
                            addressPostcode: addressInputFields.addressPostcode ?? "",
                        } as Address,
                    },
                },
            });
        } else {
            dispatchBatchTableAction({
                type: "update_cell",
                updateCellPayload: {
                    rowId: id,
                    newValueAndFieldName: {
                        type: "client",
                        fieldName: "address",
                        newValue: null,
                    },
                },
            });
        }
        simulateEscapeKeyPress();
    };

    const checkInputValidity = (): boolean => {
        let valid = true;
        if (isAddressLine1Empty || !addressInputFields?.addressLine1) {
            valid = false;
            setIsAddressLine1Empty(true);
        }
        if (isAddressTownEmpty || !addressInputFields?.addressTown) {
            valid = false;
            setIsAddressTownEmpty(true);
        }
        if (isPostcodeNotValid || !addressInputFields?.addressPostcode?.match(postcodeRegex)) {
            valid = false;
            setIsPostcodeNotValid(true);
        }
        return valid;
    };

    return (
        <GappedDivMargin>
            {!clientHasNoAddress && (
                <>
                    <TopFreeFormTextInput
                        label="Address Line 1 *"
                        defaultValue={addressInputFields.addressLine1 ?? ""}
                        onChange={(event) => {
                            setAddressInputFields({
                                ...addressInputFields,
                                addressLine1: event.target.value,
                            });
                            setIsAddressLine1Empty(!event.target.value);
                        }}
                        error={isAddressLine1Empty}
                    />
                    <FreeFormTextInput
                        label="Address Line 2"
                        defaultValue={addressInputFields.addressLine2 ?? ""}
                        onChange={(event) => {
                            setAddressInputFields({
                                ...addressInputFields,
                                addressLine2: event.target.value,
                            });
                        }}
                    />
                    <FreeFormTextInput
                        label="Town *"
                        defaultValue={addressInputFields.addressTown ?? ""}
                        onChange={(event) => {
                            setAddressInputFields({
                                ...addressInputFields,
                                addressTown: event.target.value,
                            });
                            setIsAddressTownEmpty(!event.target.value);
                        }}
                        error={isAddressTownEmpty}
                    />
                    <FreeFormTextInput
                        label="County"
                        defaultValue={addressInputFields.addressCounty ?? ""}
                        onChange={(event) => {
                            setAddressInputFields({
                                ...addressInputFields,
                                addressCounty: event.target.value,
                            });
                        }}
                    />
                    <FreeFormTextInput
                        id="client-address-postcode"
                        label="Postcode* (For example, SE11 5QY)"
                        defaultValue={addressInputFields.addressPostcode ?? ""}
                        onChange={(event) => {
                            event.target.value.match(postcodeRegex)
                                ? setIsPostcodeNotValid(false)
                                : setIsPostcodeNotValid(true);
                            setAddressInputFields({
                                ...addressInputFields,
                                addressPostcode: event.target.value,
                            });
                        }}
                        error={isPostcodeNotValid}
                    />
                </>
            )}
            <FormControlLabel
                control={<Checkbox checked={clientHasNoAddress} onChange={handleCheckCheckbox} />}
                label="No address"
            />
            <CenterComponent>
                <Button
                    variant="contained"
                    onClick={() => {
                        const areInputsValid: boolean = checkInputValidity();
                        if (areInputsValid || clientHasNoAddress) {
                            dispatchInputFieldData();
                        }
                    }}
                >
                    Submit
                </Button>
            </CenterComponent>
        </GappedDivMargin>
    );
};

export default AddressEditCellInput;
