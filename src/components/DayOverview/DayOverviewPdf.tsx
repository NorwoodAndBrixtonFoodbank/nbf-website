"use client";

import React from "react";
import { Svg, Document, Page, Text, View, StyleSheet, Path } from "@react-pdf/renderer";
import { Style } from "@react-pdf/types";
import { faFlag, faSquare, IconDefinition } from "@fortawesome/free-solid-svg-icons";

import { ParcelOfSpecificDateLocation } from "@/components/DayOverview/DayOverview";
interface DayOverviewPdfProps {
    date: Date;
    location: string;
    data: ParcelOfSpecificDateLocation[];
}

interface DayOverviewCardProps extends DayOverviewPdfProps {}

interface CustomSVGProps {
    icon: IconDefinition;
    color: string;
    fill: boolean;
}

const styles = StyleSheet.create({
    page: {
        display: "flex",
        flexDirection: "column",
        fontSize: "12px",
    },
    card: {
        margin: "0px 40px 20px",
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
        justifyContent: "space-between",
        marginBottom: "5px",
    },
    svg: {
        margin: "0 1px",
        padding: "0 1px",
    },
    cell: {
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: "3px",
    },
    row: { display: "flex", flexDirection: "row" },
    bold: { fontFamily: "Helvetica-Bold" },

    // cells
    cell_logo: { flex: 1 },
    cell_name: { flex: 4 },
    cell_postcode: { flex: 4 },
    cell_time: { flex: 2 },
    cell_collection: { flex: 4 },
    cell_instructions: { flex: 10 },
});

const dateTimeToAMPM = (datetime: string): string => {
    return new Date(datetime).getHours() <= 11 ? "AM" : "PM";
};

const CustomSVG: React.FC<CustomSVGProps> = ({ icon, color, fill }) => (
    <Svg width={12} height={12} viewBox="0 0 512 512" style={styles.svg}>
        <Path
            fill={fill ? color : undefined}
            stroke={color}
            strokeWidth={40}
            d={icon.icon[4] as string}
        />
        {/*IconDefinition[4] is defined as string | string[] but in reality there is no use case*/}
        {/*with string[] as svgPathData*/}
    </Svg>
);

const DayOverviewDate: React.FC<{ date: Date }> = ({ date }) => {
    const dateString = date.toLocaleDateString("sv-SE");
    return (
        <View style={styles.row}>
            <Text style={styles.bold}>Date: </Text> <Text>{dateString}</Text>
        </View>
    );
};

const DayOverviewLocation: React.FC<{ location: string }> = ({ location }) => (
    <View style={styles.row}>
        <Text style={styles.bold}>Location: </Text> <Text>{location}</Text>
    </View>
);

const DayOverviewHeader: React.FC<{}> = () => {
    return (
        <View style={styles.row}>
            <View style={[styles.cell_logo, styles.bold, styles.cell]}></View>
            <View style={[styles.cell_name, styles.bold, styles.cell]}>
                <Text style={styles.bold}>Name</Text>
            </View>
            <View style={[styles.cell_postcode, styles.bold, styles.cell]}>
                <Text style={styles.bold}>Postcode</Text>
            </View>
            <View style={[styles.cell_time, styles.bold, styles.cell]}>
                <Text style={styles.bold}>Time</Text>
            </View>
            <View style={[styles.cell_instructions, styles.bold, styles.cell]}>
                <Text style={styles.bold}>Instructions</Text>
            </View>
        </View>
    );
};

// Database return type has null
// But we know a client foreign key must map to an existing client
// And collection_date is specified to be within a range
// Hence both cannot be null
const DayOverviewRow: React.FC<{ row: ParcelOfSpecificDateLocation }> = ({ row }) => {
    return (
        <View style={styles.row}>
            <View style={[styles.cell_logo, styles.cell]}>
                <View style={styles.row}>
                    <CustomSVG icon={faSquare} color="black" fill={false} />
                    {row.clients!.flagged_for_attention && (
                        <CustomSVG icon={faFlag} color="orange" fill={true} />
                    )}
                </View>
            </View>
            <View style={[styles.cell_name, styles.cell]}>
                <Text>{row.clients!.full_name}</Text>
            </View>
            <View style={[styles.cell_postcode, styles.cell]}>
                <Text>{row.clients!.address_postcode}</Text>
            </View>
            <View style={[styles.cell_time, styles.cell]}>
                <Text>{dateTimeToAMPM(row.collection_datetime!)}</Text>
            </View>
            <View style={[styles.cell_instructions, styles.cell]}>
                <Text>{row.clients!.delivery_instructions}</Text>
            </View>
        </View>
    );
};

const DayOverviewCard: React.FC<DayOverviewCardProps> = ({ date, location, data }) => {
    return (
        <View style={styles.card}>
            <View style={[styles.dateLocationWrap, styles.row]}>
                <DayOverviewDate date={date} />
                <DayOverviewLocation location={location} />
            </View>
            <View style={styles.table}>
                <DayOverviewHeader />
                {data.map((datum, index) => (
                    <DayOverviewRow key={index} row={datum} />
                ))}
            </View>
        </View>
    );
};

const DayOverviewPdf: React.FC<DayOverviewPdfProps> = ({ date, location, data }) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.title}>Day Overview</Text>
                <DayOverviewCard date={date} location={location} data={data} />
            </Page>
        </Document>
    );
};

export default DayOverviewPdf;
