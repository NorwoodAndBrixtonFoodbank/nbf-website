import React, { Fragment } from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { Item } from "@/components/ShoppingList/dataPreparation";

const styles = StyleSheet.create({
    row: {
        color: "black",
        flexDirection: "row",
        alignItems: "center",
    },
    description: {
        width: "60%",
    },
    xyz: {
        width: "40%",
    },
});

const TableRow = (items: Item[]): React.ReactElement => {
    const rows = Object.values(items).map((item) => (
        <View style={styles.row} key={item.description.toString()}>
            <Text style={styles.description}>{item.quantity}</Text>
            <Text style={styles.xyz}>{item.notes}</Text>
        </View>
    ));
    return <Fragment>{rows}</Fragment>;
};

export default TableRow;
