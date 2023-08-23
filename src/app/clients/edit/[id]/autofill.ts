import { Schema } from "@/database_utils";
import { ClientFields } from "@/app/clients/add/ClientForm";
import { Person } from "@/components/Form/formFunctions";
import { booleanGroup } from "@/components/DataInput/inputHandlerFactories";
import { processExtraInformation } from "@/common/formatClientsData";

const getNumberAdultsByGender = (family: Schema["families"][], gender: string): number => {
    return family.filter((member) => member.gender === gender).length;
};

const arrayToBooleanGroup = (data: string[]): booleanGroup => {
    const reverted: booleanGroup = {};
    data.forEach((value) => (reverted[value] = true));
    return reverted;
};

const autofill = (
    clientData: Schema["clients"],
    familyData: Schema["families"][]
): ClientFields => {
    const children = familyData
        .filter((member) => member.age !== null)
        .map((child): Person => {
            return {
                gender: child.gender,
                age: child.age,
                primaryKey: child.primary_key,
            };
        });

    const { nappySize, extraInformation } = processExtraInformation(clientData.extra_information);

    return {
        fullName: clientData.full_name,
        phoneNumber: clientData.phone_number,
        addressLine1: clientData.address_1,
        addressLine2: clientData.address_2,
        addressTown: clientData.address_town,
        addressCounty: clientData.address_county,
        addressPostcode: clientData.address_postcode,
        adults: [
            { gender: "other", quantity: getNumberAdultsByGender(familyData, "other") },
            { gender: "male", quantity: getNumberAdultsByGender(familyData, "male") },
            { gender: "female", quantity: getNumberAdultsByGender(familyData, "female") },
        ],
        numberChildren: children.length,
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
    };
};

export default autofill;
