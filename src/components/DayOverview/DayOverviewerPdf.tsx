"use client";

import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

import { ParcelOfSpecificDate } from "@/components/DayOverview/DayOverviewer";
interface DayOverviewerPdfProps {
    date: Date;
    location: string;
    data: ParcelOfSpecificDate[];
}

interface DayOverviewerCardProps extends DayOverviewerPdfProps {}

interface GeneralCellStyle {
    borderStyle: "solid" | "dashed" | "dotted" | undefined;
    borderWidth: number;
    borderLeftWidth: number;
    borderTopWidth: number;
    padding: string;
}

const generalCellStyle: GeneralCellStyle = {
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: "3px",
};

const styles = StyleSheet.create({
    page: {
        display: "flex",
        flexDirection: "column",
        fontSize: "12px",
    },
    card: {
        margin: "0px 20px 20px",
    },
    table: {
        borderStyle: "solid",
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    title: {
        fontFamily: "Helvetica-Bold",
        textTransform: "uppercase",
        fontSize: "30px",
        textAlign: "center",
        margin: "30px",
    },
    dateLocationWrap: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: "5px",
    },
    row: { display: "flex", flexDirection: "row" },
    bold: { fontFamily: "Helvetica-Bold" },

    // headers
    header_flag: { flex: 1, fontFamily: "Helvetica-Bold", ...generalCellStyle },
    header_name: { flex: 2, fontFamily: "Helvetica-Bold", ...generalCellStyle },
    header_postcode: { flex: 2, fontFamily: "Helvetica-Bold", ...generalCellStyle },
    header_time: { flex: 1, fontFamily: "Helvetica-Bold", ...generalCellStyle },
    header_collection: { flex: 2, fontFamily: "Helvetica-Bold", ...generalCellStyle },
    header_six: { flex: 5, fontFamily: "Helvetica-Bold", ...generalCellStyle },

    // cells
    cell_flag: { flex: 1, ...generalCellStyle },
    cell_name: { flex: 2, ...generalCellStyle },
    cell_postcode: { flex: 2, ...generalCellStyle },
    cell_time: { flex: 1, ...generalCellStyle },
    cell_collection: { flex: 2, ...generalCellStyle },
    cell_instructions: { flex: 5, ...generalCellStyle },
});

const dateTimeToAMPM = (datetime: string): string => {
    return new Date(datetime).getHours() <= 11 ? "AM" : "PM";
};

const DayOverviewerDate: React.FC<{ date: Date }> = ({ date }) => {
    const dateString = date.toLocaleDateString("sv-SE");
    return (
        <View style={styles.row}>
            <Text style={styles.bold}>Date: </Text> <Text>{dateString}</Text>
        </View>
    );
};

const DayOverviewerLocation: React.FC<{ location: string }> = ({ location }) => (
    <View style={styles.row}>
        <Text style={styles.bold}>Location: </Text> <Text>{location}</Text>
    </View>
);
const DayOverviewerHeader: React.FC<{}> = () => {
    return (
        <View style={styles.row}>
            <View style={styles.header_flag}></View>
            <View style={styles.header_name}>
                <Text style={styles.bold}>Name</Text>
            </View>
            <View style={styles.header_postcode}>
                <Text style={styles.bold}>Postcode</Text>
            </View>
            <View style={styles.header_time}>
                <Text style={styles.bold}>Time</Text>
            </View>
            <View style={styles.header_six}>
                <Text style={styles.bold}>Instructions</Text>
            </View>
        </View>
    );
};

const DayOverviewerRow: React.FC<{ row: ParcelOfSpecificDate }> = ({ row }) => {
    return (
        <View style={styles.row}>
            <View style={styles.cell_flag}>
                <Text>{row.clients.flagged_for_attention ? "Flagged" : ""}</Text>
            </View>
            <View style={styles.cell_name}>
                <Text>{row.clients.full_name}</Text>
            </View>
            <View style={styles.cell_postcode}>
                <Text>{row.clients.address_postcode}</Text>
            </View>
            <View style={styles.cell_time}>
                <Text>{dateTimeToAMPM(row.collection_datetime)}</Text>
            </View>
            <View style={styles.cell_instructions}>
                <Text>{row.clients.delivery_instructions}</Text>
            </View>
        </View>
    );
};

const DayOverviewerCard: React.FC<DayOverviewerCardProps> = ({ date, location, data }) => {
    return (
        <View style={styles.card}>
            <View style={styles.dateLocationWrap}>
                <DayOverviewerDate date={date} />
                <DayOverviewerLocation location={location} />
            </View>
            <View style={styles.table}>
                <DayOverviewerHeader />
                {data.map((datum, index) => (
                    <DayOverviewerRow key={index} row={datum} />
                ))}
            </View>
        </View>
    );
};
const DayOverviewerPdf: React.FC<DayOverviewerPdfProps> = ({ date, location, data }) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.title}>Day Overview</Text>
                <DayOverviewerCard date={date} location={location} data={data} />
            </Page>
        </Document>
    );
};

export default DayOverviewerPdf;
