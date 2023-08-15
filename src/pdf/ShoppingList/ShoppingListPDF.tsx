"use client";

import React from "react";
import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import {
    BlockProps,
    ClientSummary,
    Item,
    ShoppingListPDFProps,
} from "@/pdf/ShoppingList/dataPreparation";

const styles = StyleSheet.create({
    paper: {
        margin: "0.75in",
        lineHeight: 1.5,
    },
    flexRow: {
        display: "flex",
        flexDirection: "row",
    },
    flexColumn: {
        display: "flex",
        flexDirection: "column",
    },
    pdfHeader: {
        justifyContent: "space-between",
    },
    logoStyling: {
        maxWidth: "20%",
        alignSelf: "center",
    },
    infoBlock: {
        borderStyle: "solid",
        border: 1,
    },
    infoCell: {
        width: "50%",
        padding: 5,
    },
    table: {
        borderStyle: "solid",
        border: 1,
        padding: 5,
    },
    tableRow: {
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
    },
    normalText: {
        fontSize: "12pt",
        fontFamily: "Helvetica",
    },
});

const OneLine: React.FC<{ header: string; value: string }> = ({ header, value }) => {
    return (
        <Text style={[styles.keyText, { textTransform: "capitalize" }]}>
            {header}: <Text style={styles.normalText}>{value}</Text>
        </Text>
    );
};

const TableHeadings: React.FC<{}> = () => {
    return (
        <View style={[styles.flexRow, styles.tableRow]}>
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

const ItemToRow: React.FC<Item> = (item) => {
    return (
        <View style={[styles.flexRow, styles.tableRow]}>
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

const DisplayItemsList: React.FC<{ itemsList: Item[] }> = ({ itemsList }) => {
    return (
        <View>
            {itemsList.map((item, index) => (
                <ItemToRow {...item} key={index} />
            ))}
        </View>
    );
};

const formatCamelCaseKey = (objectKey: string): string => {
    return objectKey.replaceAll(/([a-z])([A-Z])/g, "$1 $2");
};

const DisplayAsBlock: React.FC<BlockProps> = <Prop extends BlockProps>(data: Prop) => {
    return (
        <View style={[styles.flexColumn, styles.infoCell]}>
            {Object.keys(data).map((propKey, index) => (
                <OneLine key={index} header={formatCamelCaseKey(propKey)} value={data[propKey]} />
            ))}
        </View>
    );
};

const FormatClientCell: React.FC<{ propKey: string; propValue: string }> = ({
    propKey,
    propValue,
}) => {
    return (
        <View style={styles.infoCell}>
            <OneLine header={formatCamelCaseKey(propKey)} value={propValue} />
        </View>
    );
};

const DisplayClientSummary: React.FC<ClientSummary> = (clientSummary) => {
    return (
        <>
            <View style={[styles.flexRow, styles.infoBlock]}>
                <FormatClientCell propKey="name" propValue={clientSummary.name} />
                <FormatClientCell propKey="contact" propValue={clientSummary.contact} />
            </View>
            <View style={[styles.flexRow, styles.infoBlock]}>
                <FormatClientCell propKey="address" propValue={clientSummary.address} />
                <FormatClientCell
                    propKey="extraInformation"
                    propValue={clientSummary.extraInformation}
                />
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
            <Page size="A4">
                <View style={styles.paper}>
                    <View style={[styles.flexRow, styles.pdfHeader]}>
                        <View style={[styles.flexColumn, { padding: "5" }]}>
                            <Text style={styles.title}>Shopping List</Text>
                            <Text style={styles.subtitle}>POSTCODE: {postcode}</Text>
                        </View>
                        <Image src="/logo.png" style={[styles.flexRow, styles.logoStyling]} />
                    </View>
                    <DisplayAsBlock {...parcelInfo} />
                    <DisplayClientSummary {...clientSummary} />
                    <View style={[styles.flexRow, styles.infoBlock]}>
                        <DisplayAsBlock {...householdSummary} />
                        <DisplayAsBlock {...requirementSummary} />
                    </View>
                    <View style={[styles.flexColumn, styles.table]}>
                        <TableHeadings />
                        <DisplayItemsList itemsList={itemsList} />
                    </View>
                    <View style={[styles.flexColumn, { padding: "20 5 5" }]} wrap={false}>
                        <Text style={styles.keyText}>Warehouse Manager Notes</Text>
                        <Text style={styles.normalText}>{endNotes}</Text>
                        <Text style={[styles.keyText, { paddingTop: 20 }]}>Date Packed:</Text>
                        <Text style={[styles.keyText, { paddingTop: 20 }]}>Packer Name:</Text>
                        <Text style={[styles.keyText, { paddingTop: 20 }]}>Packer Signature:</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default ShoppingListPDF;
