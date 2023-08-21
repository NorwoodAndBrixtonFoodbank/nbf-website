import { Schema } from "@/database_utils";

export interface ListTableRow {
    itemName: string;
    "1": QuantityAndNotes;
    "2": QuantityAndNotes;
    "3": QuantityAndNotes;
    "4": QuantityAndNotes;
    "5": QuantityAndNotes;
    "6": QuantityAndNotes;
    "7": QuantityAndNotes;
    "8": QuantityAndNotes;
    "9": QuantityAndNotes;
    "10": QuantityAndNotes;
}

interface QuantityAndNotes {
    quantity: string;
    notes: string;
}

export const dataToListRow = (data: Schema["lists"]): ListTableRow => {
    const listRow: ListTableRow = {
        itemName: data.item_name,
        "1": {
            quantity: data["1_quantity"],
            notes: data["1_notes"] ?? "",
        },
        "2": {
            quantity: data["2_quantity"],
            notes: data["2_notes"] ?? "",
        },
        "3": {
            quantity: data["3_quantity"],
            notes: data["3_notes"] ?? "",
        },
        "4": {
            quantity: data["4_quantity"],
            notes: data["4_notes"] ?? "",
        },
        "5": {
            quantity: data["5_quantity"],
            notes: data["5_notes"] ?? "",
        },
        "6": {
            quantity: data["6_quantity"],
            notes: data["6_notes"] ?? "",
        },
        "7": {
            quantity: data["7_quantity"],
            notes: data["7_notes"] ?? "",
        },
        "8": {
            quantity: data["8_quantity"],
            notes: data["8_notes"] ?? "",
        },
        "9": {
            quantity: data["9_quantity"],
            notes: data["9_notes"] ?? "",
        },
        "10": {
            quantity: data["10_quantity"],
            notes: data["10_notes"] ?? "",
        },
    };

    return listRow;
};
