import React from "react";
import { Page, Document, StyleSheet } from "@react-pdf/renderer";
import ItemsTable from "@/components/ShoppingList/ItemsTables";
import { Item } from "@/components/ShoppingList/dataPreparation";

const styles = StyleSheet.create({
    page: {
        fontSize: 11,
        flexDirection: "column",
    },
});

const Table = (items: Item[]): React.ReactElement => (
    <Document>
        <Page size="A4" style={styles.page}>
            <ItemsTable {...items} />
        </Page>
    </Document>
);

export default Table;
