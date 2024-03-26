"use client";

import React from "react";
import { Text, Document, Page, View, StyleSheet, Image } from "@react-pdf/renderer";

export interface DriverOverviewTableData {
    name: string;
    address: {
        line1: string;
        line2: string | null;
        town: string | null;
        county: string | null;
        postcode: string;
    };
    contact?: string;
    packingDate: string | null;
    instructions?: string;
}

export interface DriverOverviewCardDataProps {
    driverName: string;
    date: Date;
    tableData: DriverOverviewTableData[];
}

interface DriverOverviewCardProps {
    data: DriverOverviewCardDataProps;
}

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
    tableSection: {
        width: "100%",
        borderTop: "none",
        borderBottom: "1px solid black",
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
        width: "25%",
    },
});

const DriverOverviewCard: React.FC<DriverOverviewCardProps> = ({ data }) => {
    const header = (
        <View style={[styles.tableHeader, styles.flexRow]}>
            <View style={[styles.tableColumn, styles.nameColumnWidth]}>
                <Text>Name</Text>
            </View>
            <View style={[styles.tableColumn, styles.addressColumnWidth]}>
                <Text>Address</Text>
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
        </View>
    );

    const table = data.tableData.map((rowData, index) => {
        return (
            // eslint-disable-next-line react/no-array-index-key
            <View key={index} style={[styles.tableRow, styles.flexRow]} wrap={false}>
                <View style={[styles.tableColumn, styles.nameColumnWidth]}>
                    <Text>{rowData.name}</Text>
                </View>
                <View style={[styles.tableColumn, styles.addressColumnWidth]}>
                    <Text>{rowData.address.line1}</Text>
                    <Text>{rowData.address.line2}</Text>
                    <Text>{rowData.address.town}</Text>
                    <Text>{rowData.address.county}</Text>
                    <Text>{rowData.address.postcode}</Text>
                </View>
                <View style={[styles.tableColumn, styles.contactColumnWidth]}>
                    <Text>{rowData.contact}</Text>
                </View>
                <View style={[styles.tableColumn, styles.packingDateColumnWidth]}>
                    <Text>{rowData.packingDate ? rowData.packingDate : "No recorded date"}</Text>
                </View>
                <View style={[styles.tableColumn, styles.instructionsColumnWidth]}>
                    <Text>{rowData.instructions}</Text>
                </View>
            </View>
        );
    });

    return (
        <Document>
            <Page size="A4" style={[styles.container, styles.flexColumn]}>
                <View style={[styles.infoAndLogoContainer, styles.flexRow]}>
                    <View style={styles.informationContainer}>
                        <Text style={styles.h1text}>Driver Overview</Text>
                        <Text style={styles.h2text}>Driver Name: {data.driverName}</Text>
                        <Text style={styles.h2text}>Date: {data.date.toLocaleDateString()} </Text>
                    </View>
                    {/* eslint-disable-next-line -- needed to remove the need for alt text on the logo */}
                    <Image src="/logo.png" style={styles.logoStyling}></Image>
                </View>
                <View style={styles.warningSection}>
                    <Text style={styles.h3text}>
                        At the end of your shift, please call/text the Dispatch phone to let us know
                        all deliveries have been completed or to report any issues.
                    </Text>
                    <Text style={styles.h3text}>
                        In an emergency, please ring Elizabeth or Rebekah.
                    </Text>
                    <Text style={styles.h3text}>
                        Dispatch- 07840 821 794 | Elizabeth- 07722 121 108 | Rebekah- 07366 574 794
                    </Text>
                    <Text style={[styles.h3text, { fontFamily: "Helvetica-Bold" }]}>
                        THIS SHEET MUST BE DESTROYED OR RETURNED TO THE WAREHOUSE IMMEDIATELY ON
                        COMPLETION OF DELIVERIES
                    </Text>
                </View>
                <View style={[styles.flexColumn, { width: "100%" }]}>{header}</View>
                <View style={[styles.tableSection, styles.flexColumn]}>{table}</View>
            </Page>
        </Document>
    );
};

export default DriverOverviewCard;
