"use client";

import React from "react";
import { Text, Document, Page, View, StyleSheet, Image } from "@react-pdf/renderer";
import { displayNameForNullDriverName, displayPostcodeForHomelessClient } from "@/common/format";
import { faTruck, faShoePrints, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import FontAwesomeIconPdfComponent from "../FontAwesomeIconPdfComponent";

export interface DriverOverviewRowData {
    name: string;
    address: {
        line1: string;
        line2: string | null;
        town: string | null;
        county: string | null;
        postcode: string | null;
    };
    contact?: string;
    packingDate: string | null;
    instructions?: string;
    clientIsActive: boolean;
    numberOfLabels: number;
    collectionCentre: string;
    isDelivery: boolean;
}

export interface DriverOverviewCardDataProps {
    driverName: string | null;
    date: Date;
    tableData: DriverOverviewTablesData;
    message: string;
}

interface DriverOverviewCardProps {
    data: DriverOverviewCardDataProps;
}

enum Method {
    Delivery = "Delivery",
    Collection = "Collection",
}

export type DriverOverviewTablesData = {
    collections: DriverOverviewRowData[];
    deliveries: DriverOverviewRowData[];
};

const styles = StyleSheet.create({
    container: {
        padding: 25,
        alignItems: "center",
        fontFamily: "Helvetica",
    },
    infoAndLogoContainer: {
        height: 100,
        width: "100%",
    },
    informationContainer: {
        border: "2 solid black",
        alignSelf: "flex-start",
        margin: 10,
        padding: 10,
    },
    h1text: {
        fontSize: 24,
        paddingLeft: 10,
        paddingRight: 20,
        paddingBottom: 5,
    },
    h2text: {
        fontSize: 12,
        paddingLeft: 10,
    },
    logoStyling: {
        maxHeight: 60,
        maxWidth: 102, // maintains aspect ratio of logo
        alignSelf: "center",
        marginRight: 15,
    },
    warningSection: {
        width: "100%",
        paddingBottom: 10,
    },
    h3text: {
        fontSize: 8,
        paddingLeft: 15,
        paddingTop: 5,
    },
    tableContainer: {
        width: "100%",
    },
    tableSection: {
        width: "100%",
        borderTop: "none",
        borderBottom: "1px solid black",
        marginBottom: "15px",
    },
    tableRow: {
        width: "100%",
        fontSize: 8,
        borderLeft: "1px solid black",
        borderRight: "1px solid black",
    },
    tableColumn: {
        padding: 5,
        border: "1 solid black",
        margin: 0.3,
    },
    flexColumn: {
        flexDirection: "column",
        display: "flex",
    },
    flexRow: {
        flexDirection: "row",
        display: "flex",
        justifyContent: "space-between",
    },
    tableHeader: {
        border: "1 solid black",
        borderBottom: "none",
        fontSize: 12,
    },
    nameColumnWidth: {
        width: "15%",
    },
    addressColumnWidth: {
        width: "20%",
    },
    contactColumnWidth: {
        width: "20%",
    },
    packingDateColumnWidth: {
        width: "20%",
    },
    instructionsColumnWidth: {
        width: "20%",
    },
    numberOfLabelsColumnWidth: {
        width: "20%",
    },
    collectionOrDeliveryHeader: {
        marginRight: "5px",
        marginBottom: "5px",
        alignSelf: "flex-start",
    },
});

const DriverOverviewCard: React.FC<DriverOverviewCardProps> = ({ data }) => {
    const createHeader = (category: Method): React.JSX.Element => {
        return (
            <View style={[styles.tableHeader, styles.flexRow]}>
                <View style={[styles.tableColumn, styles.nameColumnWidth]}>
                    <Text>Name</Text>
                </View>
                <View style={[styles.tableColumn, styles.addressColumnWidth]}>
                    <Text>{category === Method.Collection ? "Collection Centre" : "Address"}</Text>
                </View>
                <View style={[styles.tableColumn, styles.contactColumnWidth]}>
                    <Text>Contact</Text>
                </View>
                <View style={[styles.tableColumn, styles.packingDateColumnWidth]}>
                    <Text>Packing Date</Text>
                </View>
                <View style={[styles.tableColumn, styles.instructionsColumnWidth]}>
                    <Text>Instructions</Text>
                </View>
                <View style={[styles.tableColumn, styles.numberOfLabelsColumnWidth]}>
                    <Text>Number of Parcels</Text>
                </View>
            </View>
        );
    };

    const createRow = (rowData: DriverOverviewRowData, index: number): React.JSX.Element => {
        return (
            // eslint-disable-next-line react/no-array-index-key
            <View key={index} style={[styles.tableRow, styles.flexRow]} wrap={false}>
                <View style={[styles.tableColumn, styles.nameColumnWidth]}>
                    <Text>{rowData.name}</Text>
                </View>
                <View style={[styles.tableColumn, styles.addressColumnWidth]}>
                    {rowData.isDelivery ? (
                        rowData.address.postcode || rowData.clientIsActive ? (
                            <>
                                <Text>{rowData.address.line1}</Text>
                                <Text>{rowData.address.line2}</Text>
                                <Text>{rowData.address.town}</Text>
                                <Text>{rowData.address.county}</Text>
                                <Text>{rowData.address.postcode}</Text>
                            </>
                        ) : (
                            <Text>
                                {rowData.clientIsActive ? displayPostcodeForHomelessClient : "-"}
                            </Text>
                        )
                    ) : (
                        <>
                            <Text>{rowData.collectionCentre}</Text>
                        </>
                    )}
                </View>
                <View style={[styles.tableColumn, styles.contactColumnWidth]}>
                    <Text>{rowData.contact}</Text>
                </View>
                <View style={[styles.tableColumn, styles.packingDateColumnWidth]}>
                    <Text>{rowData.packingDate || "No recorded date"}</Text>
                </View>
                <View style={[styles.tableColumn, styles.instructionsColumnWidth]}>
                    <Text>{rowData.instructions}</Text>
                </View>
                <View style={[styles.tableColumn, styles.numberOfLabelsColumnWidth]}>
                    <Text>{rowData.numberOfLabels || "No labels downloaded"}</Text>
                </View>
            </View>
        );
    };

    const createTable = (
        name: string,
        header: React.JSX.Element,
        tableRows: React.JSX.Element[],
        icon: IconDefinition
    ): React.JSX.Element => {
        return (
            <View style={styles.tableContainer}>
                <View style={[styles.h2text, styles.collectionOrDeliveryHeader, styles.flexRow]}>
                    <Text style={[styles.collectionOrDeliveryHeader]}>{name}</Text>
                    <FontAwesomeIconPdfComponent faIcon={icon}></FontAwesomeIconPdfComponent>
                </View>
                <View style={[styles.flexColumn, { width: "100%" }]}>{header}</View>
                <View style={[styles.tableSection, styles.flexColumn]}>{tableRows}</View>
            </View>
        );
    };

    const deliveriesHeader: React.JSX.Element = createHeader(Method.Delivery);
    const collectionsHeader: React.JSX.Element = createHeader(Method.Collection);
    const collections: React.JSX.Element[] = data.tableData.collections.map(createRow);
    const deliveries: React.JSX.Element[] = data.tableData.deliveries.map(createRow);

    const collectionsTable = createTable(
        "Collections",
        collectionsHeader,
        collections,
        faShoePrints
    );
    const deliveriesTable = createTable("Deliveries", deliveriesHeader, deliveries, faTruck);

    return (
        <Document>
            <Page size="A4" style={[styles.container, styles.flexColumn]}>
                <View style={[styles.infoAndLogoContainer, styles.flexRow]}>
                    <View style={styles.informationContainer}>
                        <Text style={styles.h1text}>Driver Overview</Text>
                        <Text style={styles.h2text}>
                            Driver Name: {data.driverName ?? displayNameForNullDriverName}
                        </Text>
                        <Text style={styles.h2text}>Date: {data.date.toLocaleDateString()} </Text>
                    </View>
                    {/* eslint-disable-next-line -- needed to remove the need for alt text on the logo */}
                    <Image src="/logo.png" style={styles.logoStyling}></Image>
                </View>
                <View style={styles.warningSection}>
                    <Text style={styles.h3text}>{data.message}</Text>
                    <Text style={[styles.h3text, { fontFamily: "Helvetica-Bold" }]}>
                        THIS SHEET MUST BE DESTROYED OR RETURNED TO THE WAREHOUSE IMMEDIATELY ON
                        COMPLETION OF DELIVERIES
                    </Text>
                </View>
                {deliveries.length && deliveriesTable}
                {collections.length && collectionsTable}
            </Page>
        </Document>
    );
};

export default DriverOverviewCard;
