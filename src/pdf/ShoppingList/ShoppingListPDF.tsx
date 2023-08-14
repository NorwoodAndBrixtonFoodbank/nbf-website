"use client";

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import {
    ClientSummary,
    HouseholdSummary,
    Item,
    ParcelInfo,
    RequirementSummary,
    ShoppingListPDFProps,
} from "@/pdf/ShoppingList/dataPreparation";
import React from "react";

const styles = StyleSheet.create({
    paper: {
        margin: "0.75in",
        lineHeight: 1.5,
    },
    cell: {
        display: "flex",
        padding: "20 5 5",
    },
    infoBlock: {
        display: "flex",
        flexDirection: "row",
        borderStyle: "solid",
        border: 1,
    },
    infoCell: {
        display: "flex",
        width: "50%",
        padding: 5,
    },
    table: {
        display: "flex",
        flexDirection: "column",
        borderStyle: "solid",
        border: 1,
        padding: 5,
    },
    tableRow: {
        display: "flex",
        flexDirection: "row",
        borderBottomStyle: "solid",
        borderBottom: 1,
        paddingVertical: 4,
        textAlign: "center",
    },
    tableItemDescription: {
        width: "25%",
    },
    tableQuantity: {
        width: "35%",
    },
    tableNotes: {
        width: "30%",
    },
    tableDone: {
        width: "10%",
    },
    title: {
        fontSize: "30pt",
        fontFamily: "Helvetica-Bold",
    },
    subtitle: {
        fontSize: "24pt",
        fontFamily: "Helvetica",
    },
    keyText: {
        fontSize: "12pt",
        fontFamily: "Helvetica-Bold",
        textTransform: "capitalize",
    },
    normalText: {
        fontSize: "12pt",
        fontFamily: "Helvetica",
    },
    input: {
        fontSize: "12pt",
        fontFamily: "Helvetica-Bold",
        paddingTop: 20,
    },
});

const OneLine: React.FC<{ header: string; value: string }> = ({ header, value }) => {
    return (
        <Text style={styles.keyText}>
            {header}: <Text style={styles.normalText}>{value}</Text>
        </Text>
    );
};

const TableHeadings: React.FC<{}> = () => {
    return (
        <View style={styles.tableRow}>
            <View style={styles.tableItemDescription}>
                <Text style={styles.keyText}>Item Description</Text>
            </View>
            <View style={styles.tableQuantity}>
                <Text style={styles.keyText}>Quantity</Text>
            </View>
            <View style={styles.tableNotes}>
                <Text style={styles.keyText}>Notes</Text>
            </View>
            <View style={styles.tableDone}>
                <Text style={styles.keyText}>Done</Text>
            </View>
        </View>
    );
};

const DisplayItemsList: React.FC<{ itemsList: Item[] }> = ({ itemsList }) => {
    const ItemToRow: React.FC<Item> = (item) => {
        return (
            <View style={styles.tableRow}>
                <View style={styles.tableItemDescription}>
                    <Text style={styles.normalText}>{item.description}</Text>
                </View>
                <View style={styles.tableQuantity}>
                    <Text style={styles.normalText}>{item.quantity}</Text>
                </View>
                <View style={styles.tableNotes}>
                    <Text style={styles.normalText}>{item.notes}</Text>
                </View>
                <View style={styles.tableDone}></View>
            </View>
        );
    };

    return (
        <View>
            {itemsList.map((item, index) => (
                <ItemToRow {...item} key={index} />
            ))}
        </View>
    );
};

const formatKey = (objectKey: string): string => {
    return objectKey.replace(/([a-z])([A-Z])/g, "$1 $2");
};

const DisplayAsBlock: React.FC<ParcelInfo | HouseholdSummary | RequirementSummary> = (data) => {
    return (
        <View style={styles.infoCell}>
            {Object.keys(data).map((propKey, index) => (
                <OneLine
                    key={index}
                    header={formatKey(propKey)}
                    value={data[propKey as keyof typeof data]}
                />
            ))}
        </View>
    );
};

const DisplayClientSummary: React.FC<ClientSummary> = (clientSummary) => {
    const FormatCell: React.FC<{ propKey: string }> = ({ propKey }) => {
        return (
            <View style={styles.infoCell}>
                <View style={styles.normalText}>
                    <OneLine
                        header={formatKey(propKey)}
                        value={clientSummary[propKey as keyof ClientSummary]}
                    />
                </View>
            </View>
        );
    };

    return (
        <>
            <View style={styles.infoBlock}>
                <FormatCell propKey="name" />
                <FormatCell propKey="contact" />
            </View>
            <View style={styles.infoBlock}>
                <FormatCell propKey="address" />
                <FormatCell propKey="extraInformation" />
            </View>
        </>
    );
};

const ShoppingListPDF: React.FC<ShoppingListPDFProps> = ({
    postcode,
    parcelInfo,
    clientSummary,
    householdSummary,
    requirementSummary,
    itemsList,
    endNotes,
}) => {
    return (
        <Document>
            <Page>
                <View style={styles.paper}>
                    <View style={styles.cell}>
                        <Text style={styles.title}>Shopping List</Text>
                        <Text style={styles.subtitle}>POSTCODE: {postcode}</Text>
                    </View>
                    <DisplayAsBlock {...parcelInfo} />
                    <DisplayClientSummary {...clientSummary} />
                    <View style={styles.infoBlock}>
                        <DisplayAsBlock {...householdSummary} />
                        <DisplayAsBlock {...requirementSummary} />
                    </View>
                    <View style={styles.table}>
                        <TableHeadings />
                        <DisplayItemsList itemsList={itemsList} />
                    </View>
                    <View style={styles.cell} wrap={false}>
                        <Text style={styles.keyText}>Warehouse Manager Notes</Text>
                        <Text style={styles.normalText}>{endNotes}</Text>
                        <Text style={styles.input}>Date Packed:</Text>
                        <Text style={styles.input}>Packer Name:</Text>
                        <Text style={styles.input}>Packer Signature:</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default ShoppingListPDF;
