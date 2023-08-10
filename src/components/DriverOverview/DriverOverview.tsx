"use client";

import React from "react";
import { Text, Document, Page, View, StyleSheet, Image } from "@react-pdf/renderer";
import { Schema } from "@/supabase";

export interface DriverOverviewCardProps {
    driverName: string;
    date: Date;
    data: any;
}

const styles = StyleSheet.create({
    container: {
        padding: 25,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    headerDivider: {
        height: "100",
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    image: {
        alignSelf: "flex-end",
        maxWidth: 120,
        maxHeight: 100,
    },
    tableSection: {
        backgroundColor: "#00FF00",
        height: "500",
        width: "100%",
    },
    warningSection: {
        width: "100%",
        paddingBottom: 10,
    },
    informationContainer: {
        border: "1 solid black",
        alignSelf: "flex-start",
        margin: 10,
        backgroundColor: "#FFFFFF",
    },
    h1text: {
        fontSize: 24,
        paddingLeft: 10,
        paddingRight: 20,
        paddingBottom: 5,
    },
    h2text: {
        fontSize: 12,
        paddingLeft: 15,
    },
    h3text: {
        fontSize: 8,
        paddingLeft: 15,
        paddingTop: 5,
    },
    flexColumn: {
        flexDirection: "column",
    },
});

const DriverOverviewCard: React.FC = ({
    driverName,
    date,
    data,
}: DriverOverviewCardProps): Promise<React.ReactElement> => {
    const dateConverter: (date: Date) => string = (date) => {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <Document>
            <Page size="A4" style={styles.container}>
                <View style={styles.headerDivider}>
                    <View style={styles.informationContainer}>
                        <Text style={styles.h1text}>Driver Overview</Text>
                        <Text style={styles.h2text}>Driver Name: {driverName}</Text>
                        <Text style={styles.h2text}>Date: {dateConverter(date)} </Text>
                    </View>
                    {/* eslint-disable-next-line */}
                    <Image
                        src="https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png"
                        style={styles.image}
                    ></Image>
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
                    <Text style={styles.h3text}>
                        THIS SHEET MUST BE DESTROYED OR RETURNED TO THE WAREHOUSE IMMEDIATELY ON
                        COMPLETION OF DELIVERIES
                    </Text>
                </View>
                <View style={styles.tableSection}>
                    <Text>{String(data)}</Text>
                </View>
            </Page>
        </Document>
    );
};

export default DriverOverviewCard;
