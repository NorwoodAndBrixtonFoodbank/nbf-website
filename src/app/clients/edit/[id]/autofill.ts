import { Schema } from "@/databaseUtils";
import { ClientFields } from "@/app/clients/form/ClientForm";
import { Person } from "@/components/Form/formFunctions";
import { BooleanGroup } from "@/components/DataInput/inputHandlerFactories";
import { processExtraInformation } from "@/common/formatClientsData";

const isAdult = (member: Schema["families"]): boolean => {
    return member.birth_year <= 2007;
};

const arrayToBooleanGroup = (data: string[]): BooleanGroup => {
    const reverted: BooleanGroup = {};
    data.forEach((value) => (reverted[value] = true));
    return reverted;
};

const autofill = (
    clientData: Schema["clients"],
    familyData: Schema["families"][]
): ClientFields => {
    const children = familyData
        .filter((member) => !isAdult(member))
        .map((child): Person => {
            return {
                gender: child.gender,
                birthYear: child.birth_year,
                birthMonth: child.birth_month,
                primaryKey: child.primary_key,
            };
        });

    const adults = familyData
        .filter((member) => isAdult(member))
        .map((adult): Person => {
            return {
                gender: adult.gender,
                birthYear: adult.birth_year,
                primaryKey: adult.primary_key,
            };
        });

    const { nappySize, extraInformation } = processExtraInformation(clientData.extra_information);

    const noPostcode = clientData.address_postcode === null;

    return {
        fullName: clientData.full_name,
        phoneNumber: clientData.phone_number,
        addressLine1: noPostcode ? "" : clientData.address_1,
        addressLine2: noPostcode ? "" : clientData.address_2,
        addressTown: noPostcode ? "" : clientData.address_town,
        addressCounty: noPostcode ? "" : clientData.address_county,
        addressPostcode: clientData.address_postcode,
        numberOfAdults: adults.length,
        adults: adults,
        numberOfChildren: children.length,
        children: children,
        dietaryRequirements: arrayToBooleanGroup(clientData.dietary_requirements),
        feminineProducts: arrayToBooleanGroup(clientData.feminine_products),
        babyProducts: clientData.baby_food,
        nappySize: nappySize.replace("Nappy Size: ", ""),
        petFood: arrayToBooleanGroup(clientData.pet_food),
        otherItems: arrayToBooleanGroup(clientData.other_items),
        deliveryInstructions: clientData.delivery_instructions,
        extraInformation: extraInformation,
        attentionFlag: clientData.flagged_for_attention,
        signpostingCall: clientData.signposting_call_required,
        lastUpdated: clientData.last_updated,
    };
};

export default autofill;
