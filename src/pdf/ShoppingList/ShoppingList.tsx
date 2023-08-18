import React from "react";
import prepareData from "@/pdf/ShoppingList/dataPreparation";
import ShoppingListButton from "@/pdf/ShoppingList/ShoppingListButton";

interface Props {
    text: string;
    parcelID: string;
}

const ShoppingList = async ({ text, parcelID }: Props): Promise<React.ReactElement> => {
    const data = await prepareData(parcelID);
    return <ShoppingListButton data={data} text={text} />;
};

export default ShoppingList;
