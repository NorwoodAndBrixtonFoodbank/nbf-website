"use client";

import React from "react";
import { Text, Document, Page, View, StyleSheet, Image } from "@react-pdf/renderer";

export interface DriverOverviewCardProps {
    driverName: string;
    date: string;
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    headerDivider: {
        width: "90%",
        height: "100",
        flexDirection: "row",
    },
    tableSection: {
        width: "90%",
        backgroundColor: "#00FF00",
        height: "500",
    },
    warningSection: {
        width: "90%",
        backgroundColor: "#0000FF",
        height: "200",
    },
    informationContainer: {
        width: "50%",
        height: "100",
        border: "1 solid black",
    },
    h1text: {
        fontSize: 24,
        paddingLeft: 10,
        paddingTop: 10,
        paddingBottom: 5,
    },
    h2text: {
        fontSize: 12,
        paddingLeft: 15,
    },
});

const DriverOverviewCard: React.FC<DriverOverviewCardProps> = ({ driverName, date }) => {
    return (
        <Document>
            <Page size="A4" style={styles.container}>
                <View style={styles.headerDivider}>
                    <View style={styles.informationContainer}>
                        <Text style={styles.h1text}>Driver Overview</Text>
                        <Text style={styles.h2text}>Driver Name: {driverName}</Text>
                        <Text style={styles.h2text}>Date: {date} </Text>
                    </View>
                    <View style={styles.informationContainer}>
                        <Image src="/logo.webp" /> {/* eslint-disable-line */}
                    </View>
                </View>
                <View style={styles.tableSection}></View>
                <View style={styles.warningSection}></View>
            </Page>
        </Document>
    );
};

export default DriverOverviewCard;
