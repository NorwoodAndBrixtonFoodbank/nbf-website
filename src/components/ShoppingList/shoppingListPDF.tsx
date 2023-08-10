"use client";

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import {
    ClientSummary,
    HouseholdSummary,
    Item,
    ParcelInfo,
    RequirementSummary,
    ShoppingListProps,
} from "@/components/ShoppingList/dataPreparation";
import React from "react";

const styles = StyleSheet.create({
    centerComponent: {
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        margin: "2em",
    },
    paper: {
        width: "min(80%, 1000px)",
    },
    cell: {
        display: "flex",
        outline: "1px solid ${(props) => props.theme.primaryForegroundColor}",
    },
    infoBlock: {},
    table: {},
    title: {
        fontSize: "large",
        padding: "1rem",
    },
    subtitle: {
        fontSize: "medium",
        padding: "1rem",
    },
    keyText: {
        fontSize: "small",
        fontWeight: "semibold",
        padding: "0.5rem",
    },
    normalText: {
        fontSize: "small",
        fontWeight: "normal",
        padding: "0.5rem",
    },
    lineBreak: {},
});

const OneLine: React.FC<{ header: string; value: string }> = ({ header, value }) => {
    return (
        <Text style={styles.keyText}>
            {header.toUpperCase()}:<Text style={styles.normalText}>{value}</Text>
        </Text>
    );
};

const TableHeadings: React.FC<{}> = () => {
    return (
        <View>
            <View style={styles.cell}>
                <Text style={styles.keyText}>Item Description</Text>
            </View>
            <View style={styles.cell}>
                <Text style={styles.keyText}>Quantity</Text>
            </View>
            <View style={styles.cell}>
                <Text style={styles.keyText}>Notes</Text>
            </View>
            <View style={styles.cell}>
                <Text style={styles.keyText}>Done</Text>
            </View>
        </View>
    );
};

const DisplayItemsList: React.FC<{ itemsList: Item[] }> = ({ itemsList }) => {
    const ItemToRow: React.FC<Item> = (item) => {
        return (
            <View>
                <View style={styles.cell}>
                    <Text style={styles.normalText}>{item.description}</Text>
                </View>
                <View style={styles.cell}>
                    <Text style={styles.normalText}>{item.quantity}</Text>
                </View>
                <View style={styles.cell}>
                    <Text style={styles.normalText}>{item.notes}</Text>
                </View>
                <View style={styles.cell}></View>
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
    return objectKey.replace("_", " ");
};

const DisplayAsBlock: React.FC<ParcelInfo | HouseholdSummary | RequirementSummary> = (data) => {
    return (
        <View style={styles.cell}>
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
    return (
        <View>
            {Object.keys(clientSummary).map((propKey, index) => (
                <View style={styles.cell} key={index}>
                    <View style={styles.lineBreak}>
                        <OneLine
                            header={formatKey(propKey)}
                            value={clientSummary[propKey as keyof ClientSummary]}
                        />
                    </View>
                </View>
            ))}
        </View>
    );
};

const ShoppingList: React.FC<ShoppingListProps> = ({
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
                <View style={styles.centerComponent}>
                    <View style={styles.paper}>
                        <View style={styles.cell}>
                            <Text style={styles.title}>Shopping List</Text>
                            <Text style={styles.subtitle}>POSTCODE: {postcode}</Text>
                        </View>
                        <DisplayAsBlock {...parcelInfo} />
                        <View style={styles.infoBlock}>
                            <DisplayClientSummary {...clientSummary} />
                            <DisplayAsBlock {...householdSummary} />
                            <DisplayAsBlock {...requirementSummary} />
                        </View>
                        <View style={styles.table}>
                            <TableHeadings />
                            <DisplayItemsList itemsList={itemsList} />
                        </View>
                        <View style={styles.cell}>
                            <Text style={styles.keyText}>Warehouse Manager Notes</Text>
                            <Text style={styles.normalText}>{endNotes}</Text>
                            <OneLine header="Date Packed" value="" />
                            <OneLine header="Packer Name" value="" />
                            <OneLine header="Packer Signature" value="" />
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default ShoppingList;
