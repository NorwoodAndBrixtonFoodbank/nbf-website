"use client";

import React, { useEffect, useState } from "react";
import {
    checkErrorOnSubmit,
    Errors,
    Fields,
    FormErrors,
    createSetter,
    CardProps,
} from "@/components/Form/formFunctions";
import {
    CenterComponent,
    FormErrorText,
    StyledForm,
    StyledName,
} from "@/components/Form/formStyling";

import { useRouter } from "next/navigation";

import VoucherNumberCard from "@/app/parcels/form/formSections/VoucherNumberCard";
import PackingDateCard from "@/app/parcels/form/formSections/PackingDateCard";
import ShippingMethodCard from "@/app/parcels/form/formSections/ShippingMethodCard";
import CollectionDateCard from "@/app/parcels/form/formSections/CollectionDateCard";
import CollectionTimeCard from "@/app/parcels/form/formSections/CollectionTimeCard";
import CollectionCentreCard from "@/app/parcels/form/formSections/CollectionCentreCard";
import { insertParcel, updateParcel } from "@/app/parcels/form/clientDatabaseFunctions";
import { Button, IconButton } from "@mui/material";
import Title from "@/components/Title/Title";
import { Schema } from "@/databaseUtils";
import dayjs, { Dayjs } from "dayjs";
import { CollectionCentresLabelsAndValues, PackingSlotsLabelsAndValues } from "@/common/fetch";
import getExpandedClientDetails, {
    ExpandedClientData,
} from "@/app/clients/getExpandedClientDetails";
import Modal from "@/components/Modal/Modal";
import InfoIcon from "@mui/icons-material/Info";
import Icon from "@/components/Icons/Icon";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { ContentDiv, OutsideDiv } from "@/components/Modal/ModalFormStyles";
import DataViewer from "@/components/DataViewer/DataViewer";
import { useTheme } from "styled-components";
import PackingSlotsCard from "@/app/parcels/form/formSections/PackingSlotsCard";
import { getDbDate } from "@/common/format";

export interface ParcelFields extends Fields {
    clientId: string | null;
    voucherNumber: string | null;
    packingDate: string | null;
    packingSlot: string | undefined;
    shippingMethod: string | null;
    collectionDate: string | null;
    collectionTime: string | null;
    collectionCentre: string | null;
}

export interface ParcelErrors extends FormErrors<ParcelFields> {
    voucherNumber: Errors;
    packingDate: Errors;
    packingSlot: Errors;
    shippingMethod: Errors;
    collectionDate: Errors;
    collectionTime: Errors;
    collectionCentre: Errors;
}

export type ParcelCardProps = CardProps<ParcelFields, ParcelErrors>;

export const initialParcelFields: ParcelFields = {
    clientId: null,
    voucherNumber: "",
    packingDate: null,
    packingSlot: "",
    shippingMethod: null,
    collectionDate: null,
    collectionTime: null,
    collectionCentre: null,
};

export const initialParcelFormErrors: ParcelErrors = {
    voucherNumber: Errors.none,
    packingDate: Errors.initial,
    packingSlot: Errors.initial,
    shippingMethod: Errors.initial,
    collectionDate: Errors.initial,
    collectionTime: Errors.initial,
    collectionCentre: Errors.initial,
};

interface ParcelFormProps {
    initialFields: ParcelFields;
    initialFormErrors: ParcelErrors;
    clientId?: string;
    editMode: boolean;
    parcelId?: string;
    deliveryPrimaryKey: Schema["collection_centres"]["primary_key"];
    collectionCentresLabelsAndValues: CollectionCentresLabelsAndValues;
    packingSlotsLabelsAndValues: PackingSlotsLabelsAndValues;
    packingSlotIsShown?: boolean;
}

const withCollectionFormSections = [
    VoucherNumberCard,
    PackingDateCard,
    PackingSlotsCard,
    ShippingMethodCard,
    CollectionDateCard,
    CollectionTimeCard,
    CollectionCentreCard,
];

const noCollectionFormSections = [
    VoucherNumberCard,
    PackingDateCard,
    PackingSlotsCard,
    ShippingMethodCard,
];

const mergeDateAndTime = (date: string, time: string): Dayjs => {
    // dayjs objects are immutable so the setter methods return a new object
    const dayjsTime = dayjs(time);
    return dayjs(date).hour(dayjsTime.hour()).minute(dayjsTime.minute());
};

// TODO VFB-55:
// The param deliveryPrimaryKey will need to remain until VFB-55 is done.

const ParcelForm: React.FC<ParcelFormProps> = ({
    initialFields,
    initialFormErrors,
    clientId,
    editMode,
    parcelId,
    deliveryPrimaryKey,
    collectionCentresLabelsAndValues,
    packingSlotsLabelsAndValues,
    packingSlotIsShown,
}) => {
    const router = useRouter();
    const [fields, setFields] = useState(initialFields);
    const [formErrors, setFormErrors] = useState(initialFormErrors);
    const [submitError, setSubmitError] = useState(Errors.none);
    const [submitErrorMessage, setSubmitErrorMessage] = useState("");
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const [clientDetails, setClientDetails] = useState<ExpandedClientData | null>(null);
    const theme = useTheme();
    const clientIdForFetch = initialFields.clientId ? initialFields.clientId : clientId;

    useEffect(() => {
        if (!clientDetails && clientIdForFetch) {
            getExpandedClientDetails(clientIdForFetch)
                .then((response) => {
                    setClientDetails(response);
                })
                .catch(() => {
                    setClientDetails(null);
                });
        }
    }, [clientDetails, clientIdForFetch]);

    useEffect(() => {
        if (editMode && !packingSlotIsShown) {
            setFormErrors((currentState) => ({
                ...currentState,
                packingSlot: Errors.invalidPackingSlot,
            }));
        }
    }, []);

    const formSections =
        fields.shippingMethod === "Collection"
            ? withCollectionFormSections
            : noCollectionFormSections;

    const fieldSetter = createSetter(setFields, fields);
    const errorSetter = createSetter(setFormErrors, formErrors);

    const submitForm = async (): Promise<void> => {
        setSubmitErrorMessage("");
        setSubmitDisabled(true);
        let inputError;
        if (fields.shippingMethod === "Collection") {
            inputError = checkErrorOnSubmit(formErrors, setFormErrors);
        } else {
            inputError = checkErrorOnSubmit(formErrors, setFormErrors, [
                "voucherNumber",
                "packingDate",
                "packingSlot",
                "shippingMethod",
            ]);
        }
        if (inputError) {
            setSubmitError(Errors.submit);
            setSubmitDisabled(false);
            return;
        }

        const packingDate = getDbDate(dayjs(fields.packingDate));

        let collectionDateTime = null;
        if (fields.shippingMethod === "Collection") {
            collectionDateTime = mergeDateAndTime(
                fields.collectionDate!,
                fields.collectionTime!
            ).toISOString();
        }

        const isDelivery = fields.shippingMethod === "Delivery";

        const formToAdd = {
            primary_key: parcelId!,
            client_id: (clientId || fields.clientId)!,
            packing_date: packingDate,
            packing_slot: fields.packingSlot,
            voucher_number: fields.voucherNumber,
            collection_centre: isDelivery ? deliveryPrimaryKey : fields.collectionCentre,
            collection_datetime: collectionDateTime,
        };

        try {
            if (editMode) {
                await updateParcel(formToAdd, parcelId!);
            } else {
                await insertParcel(formToAdd);
            }
            router.push("/parcels/");
        } catch (error: unknown) {
            if (error instanceof Error) {
                setSubmitError(Errors.external);
                setSubmitErrorMessage(error.message);
            }
        }
        setSubmitDisabled(false);
    };

    return (
        <CenterComponent>
            <StyledForm>
                <Title>Parcel Form</Title>
                {clientDetails && (
                    <StyledName>
                        <h2>{clientDetails.fullName}</h2>
                        <IconButton
                            aria-label="Button for Client Information"
                            type="button"
                            size="large"
                            onClick={() => {
                                setModalIsOpen(true);
                            }}
                        >
                            <InfoIcon />
                        </IconButton>
                    </StyledName>
                )}
                {formSections.map((Card, index) => {
                    return (
                        <Card
                            key={index} // eslint-disable-line react/no-array-index-key
                            formErrors={formErrors}
                            errorSetter={errorSetter}
                            fieldSetter={fieldSetter}
                            fields={fields}
                            collectionCentresLabelsAndValues={collectionCentresLabelsAndValues}
                            packingSlotsLabelsAndValues={packingSlotsLabelsAndValues}
                        />
                    );
                })}
                <CenterComponent>
                    <Button variant="contained" onClick={submitForm} disabled={submitDisabled}>
                        Submit
                    </Button>
                </CenterComponent>
                <FormErrorText>{submitErrorMessage || submitError}</FormErrorText>
            </StyledForm>
            {clientDetails && (
                <Modal
                    header={
                        <>
                            <Icon icon={faUser} color={theme.primary.background[2]} />
                            <h2>Client Details</h2>
                        </>
                    }
                    isOpen={modalIsOpen}
                    onClose={() => setModalIsOpen(false)}
                    headerId="clientsDetailModal"
                >
                    <OutsideDiv>
                        <ContentDiv>
                            <DataViewer data={{ ...clientDetails } ?? {}} />
                        </ContentDiv>
                    </OutsideDiv>
                </Modal>
            )}
        </CenterComponent>
    );
};

export default ParcelForm;
