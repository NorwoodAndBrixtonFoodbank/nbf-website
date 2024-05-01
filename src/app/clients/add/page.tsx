import { Metadata } from "next";
import React from "react";
import ClientForm, { ClientErrors, ClientFields } from "@/app/clients/form/ClientForm";
import { Errors } from "@/components/Form/formFunctions";

const AddClients: () => React.ReactElement = () => {
    const initialFields: ClientFields = {
        fullName: "",
        phoneNumber: "",
        addressLine1: "",
        addressLine2: "",
        addressTown: "",
        addressCounty: "",
        addressPostcode: "",
        adults: [],
        numberOfAdults: {
            numberFemales: 0,
            numberMales: 0,
            numberUnknownGender: 0,
        },
        numberChildren: 0,
        children: [],
        dietaryRequirements: {},
        feminineProducts: {},
        babyProducts: null,
        nappySize: "",
        petFood: {},
        otherItems: {},
        deliveryInstructions: "",
        extraInformation: "",
        attentionFlag: false,
        signpostingCall: false,
        lastUpdated: undefined,
    };

    const initialFormErrors: ClientErrors = {
        fullName: Errors.initial,
        phoneNumber: Errors.none,
        addressLine1: Errors.initial,
        addressPostcode: Errors.initial,
        adults: Errors.initial,
        numberChildren: Errors.initial,
        nappySize: Errors.none,
    };

    return (
        <main>
            <ClientForm
                initialFields={initialFields}
                initialFormErrors={initialFormErrors}
                editConfig={{ editMode: false }}
            />
        </main>
    );
};

export const metadata: Metadata = {
    title: "Add Clients",
};

export default AddClients;
