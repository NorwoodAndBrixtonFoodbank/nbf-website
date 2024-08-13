import { NAPPY_SIZE_LABEL, EXTRA_INFORMATION_LABEL } from "@/app/clients/form/labels";
import { BooleanGroup } from "@/components/DataInput/inputHandlerFactories";
import { Person } from "@/components/Form/formFunctions";
import { logErrorReturnLogId } from "@/logger/logger";
import dayjs from "dayjs";
import {
    OverrideClient,
    OverrideParcel,
    clientOverrideCellValueType,
    parcelOverrideCellValueType,
    BatchClient,
} from "@/app/parcels/batch/BatchTypes";
import { getAllPeopleFromFamily, getClientFromClients } from "@/app/parcels/batch/supabaseHelpers";

export const getOverridenFieldsAndValues = (
    allFields: OverrideClient | OverrideParcel
): (
    | { field: string; value: clientOverrideCellValueType }
    | { field: string; value: parcelOverrideCellValueType }
)[] => {
    return Object.entries(allFields)
        .filter(([_, value]) => value)
        .reduce(
            (acc, [key, value]) => {
                return [...acc, { field: key, value: value }];
            },
            [] as (
                | { field: string; value: clientOverrideCellValueType }
                | { field: string; value: parcelOverrideCellValueType }
            )[]
        );
};

function createBooleanGroupFromStrings(strings: string[] | null): BooleanGroup {
    const result: BooleanGroup = {};
    if (strings) {
        strings.forEach((str) => {
            result[str] = true;
        });
    }
    return result;
}

const getNappySize = (info: string | null): string | null => {
    if (info) {
        const match = info.match(new RegExp(`${NAPPY_SIZE_LABEL}(\\d+)`));
        if (match) {
            return match[1];
        }
    }
    return null;
};

const getChildrenAndAdults = async (
    familyId: string
): Promise<{ adults: Person[]; children: Person[] } | null> => {
    const { data, error } = await getAllPeopleFromFamily(familyId);

    const adults: Person[] = [];
    const children: Person[] = [];

    const currentDate = dayjs().startOf("day");

    if (error) {
        logErrorReturnLogId("Error with fetch: family_members", { error: error });
        return null;
    }
    if (!data) {
        return { adults: [], children: [] };
    }
    data.forEach((person) => {
        const formattedPerson: Person = {
            gender: person.gender,
            birthYear: person.birth_year,
            birthMonth: person.birth_month,
        };

        const birthDate = dayjs()
            .year(formattedPerson.birthYear)
            .month(formattedPerson.birthMonth || 0)
            .startOf("month");
        const age = currentDate.diff(birthDate, "year");
        if (age < 16) {
            children.push(formattedPerson);
        } else {
            adults.push(formattedPerson);
        }
    });
    return { adults, children };
};

const parseExtraInfo = (info: string | null): string | null => {
    if (info) {
        const match = info.match(
            new RegExp(`${NAPPY_SIZE_LABEL}\\d+,\\s*${EXTRA_INFORMATION_LABEL}(.*)`)
        );
        if (match) {
            return match[1];
        }
    }
    return info;
};

export const getClientDataForBatchParcels = async (
    clientId: string
): Promise<BatchClient | null> => {
    const { data, error } = await getClientFromClients(clientId);

    if (error) {
        logErrorReturnLogId("Error with fetch: clients", { error: error });
        return null;
    }
    if (!data) {
        return null;
    }
    const ChildrenAndAdults = await getChildrenAndAdults(data.family_id);
    if (!ChildrenAndAdults) {
        return null;
    }
    const { adults, children } = ChildrenAndAdults;
    return {
        fullName: data.full_name ?? "",
        phoneNumber: data.phone_number ?? "",
        address: {
            addressLine1: data.address_1 ?? "",
            addressLine2: data?.address_2 ?? "",
            addressTown: data?.address_town ?? "",
            addressCounty: data?.address_county ?? "",
            addressPostcode: data?.address_postcode ?? "",
        },
        adultInfo: {
            adults: adults,
            numberOfAdults: adults.length,
        },
        childrenInfo: {
            children: children,
            numberOfChildren: children.length,
        },
        listType: data.default_list ?? "regular",
        dietaryRequirements: createBooleanGroupFromStrings(data.dietary_requirements),
        feminineProducts: createBooleanGroupFromStrings(data.feminine_products),
        babyProducts: data.baby_food,
        nappySize: getNappySize(data.extra_information),
        petFood: createBooleanGroupFromStrings(data.pet_food),
        otherItems: createBooleanGroupFromStrings(data.other_items),
        deliveryInstructions: data.delivery_instructions,
        extraInformation: parseExtraInfo(data.extra_information),
        attentionFlag: data.flagged_for_attention ?? false,
        signpostingCall: data.signposting_call_required ?? false,
        notes: data.notes,
    };
};
