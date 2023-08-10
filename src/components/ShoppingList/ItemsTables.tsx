import React from "react";
import { View, StyleSheet } from "@react-pdf/renderer";
import TableRow from "./TableRow";
import { Item } from "@/components/ShoppingList/dataPreparation";

const styles = StyleSheet.create({
    tableContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
});

const ItemsTable = (items: Item[]): React.ReactElement => (
    <View style={styles.tableContainer}>
        {/*<TableHeader />*/}
        <TableRow {...items} />
        {/*<TableFooter items={data.items} />*/}
    </View>
);

export default ItemsTable;
