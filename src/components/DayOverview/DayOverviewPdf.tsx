"use client";

import React from "react";
import { Svg, Document, Page, Text, View, StyleSheet, Path } from "@react-pdf/renderer";
import { faFlag, faSquare, IconDefinition } from "@fortawesome/free-solid-svg-icons";

import {
    DayOverviewData,
    getCurrentDate,
    ParcelOfSpecificDateAndLocation,
} from "@/components/DayOverview/DayOverview";

interface DayOverviewDateProps {
    date: Date;
}

interface DayOverviewLocationProps {
    location: string;
}

interface DayOverviewRowProps {
    row: ParcelOfSpecificDateAndLocation;
}

interface DayOverviewPdfProps {
    data: DayOverviewData;
}

interface DayOverviewCardProps {
    date: Date;
    location: string;
    data: ParcelOfSpecificDateAndLocation[];
}

interface CustomSVGProps {
    icon: IconDefinition;
    color: string;
    fill: boolean;
}

const styles = StyleSheet.create({
    page: {
        display: "flex",
        flexDirection: "column",
        fontSize: "11pt",
    },
    card: {
        margin: "0 30pt 15pt",
    },
    title: {
        fontFamily: "Helvetica-Bold",
        textTransform: "uppercase",
        fontSize: "30px",
        textAlign: "center",
        margin: "0 22.5pt 22.5pt",
    },
    dateLocationWrap: {
        justifyContent: "space-between",
        marginBottom: "4pt",
    },
    svg: {
        margin: "0 0.75pt",
        padding: "0 0.75pt",
    },
    cell: {
        borderStyle: "solid",
        borderRightWidth: 1,
        borderBottomWidth: 1,
        padding: "2.25pt",
    },
    margin: { height: "37.5pt" },
    row: { display: "flex", flexDirection: "row" },
    bold: { fontFamily: "Helvetica-Bold" },

    cellLogo: { flex: 1 },
    cellName: { flex: 4 },
    cellPostcode: { flex: 4 },
    cellTime: { flex: 2 },
    cellCollection: { flex: 4 },
    cellInstructions: { flex: 10 },
});

const dateTimeToAMPM = (datetime: string): string => {
    return new Date(datetime).getHours() <= 11 ? "AM" : "PM";
};

// IconDefinition[4] is defined as string | string[] but in reality there is no use case
// with string[] as svgPathData
const CustomSVG: React.FC<CustomSVGProps> = ({ icon, color, fill }) => (
    <Svg width={11} height={11} viewBox="0 0 512 512" style={styles.svg}>
        <Path
            fill={fill ? color : undefined}
            stroke={color}
            strokeWidth={40}
            d={icon.icon[4] as string}
        />
    </Svg>
);

const DayOverviewMargin: React.FC<{}> = () => {
    return <View style={styles.margin} fixed></View>;
};

const DayOverviewDate: React.FC<DayOverviewDateProps> = ({ date }) => {
    const dateString = getCurrentDate(date, true);
    return (
        <Text>
            <Text style={styles.bold}>Date: </Text>
            {dateString}
        </Text>
    );
};

const DayOverviewLocation: React.FC<DayOverviewLocationProps> = ({ location }) => (
    <Text>
        <Text style={styles.bold}>Location: </Text>
        {location}
    </Text>
);

const DayOverviewHeader: React.FC<{}> = () => {
    return (
        <View style={[styles.row, styles.bold, { borderTop: "1 solid black" }]} fixed>
            <View style={[styles.cellLogo, styles.cell]}></View>
            <View style={[styles.cellName, styles.cell]}>
                <Text>Name</Text>
            </View>
            <View style={[styles.cellPostcode, styles.cell]}>
                <Text>Postcode</Text>
            </View>
            <View style={[styles.cellTime, styles.cell]}>
                <Text>Time</Text>
            </View>
            <View style={[styles.cellInstructions, styles.cell]}>
                <Text>Instructions</Text>
            </View>
        </View>
    );
};

const DayOverviewRow: React.FC<DayOverviewRowProps> = ({ row }) => {
    return (
        <View style={styles.row} wrap={false}>
            <View style={[styles.cellLogo, styles.cell]}>
                <View style={styles.row}>
                    <CustomSVG icon={faSquare} color="black" fill={false} />
                    {row.clients!.flagged_for_attention && (
                        <CustomSVG icon={faFlag} color="orange" fill={true} />
                    )}
                </View>
            </View>
            <View style={[styles.cellName, styles.cell]}>
                <Text>{row.clients!.full_name}</Text>
            </View>
            <View style={[styles.cellPostcode, styles.cell]}>
                <Text>{row.clients!.address_postcode}</Text>
            </View>
            <View style={[styles.cellTime, styles.cell]}>
                <Text>{dateTimeToAMPM(row.collection_datetime!)}</Text>
            </View>
            <View style={[styles.cellInstructions, styles.cell]}>
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
            <View style={{ borderLeft: "1 solid black" }}>
                <DayOverviewHeader />
                {data.map((datum, index) => (
                    <DayOverviewRow key={index} row={datum} />
                ))}
            </View>
        </View>
    );
};

const DayOverviewPdf: React.FC<DayOverviewPdfProps> = ({ data }) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <DayOverviewMargin />
                <Text style={styles.title}>Day Overview</Text>
                <DayOverviewCard date={data.date} location={data.location} data={data.data} />
                <DayOverviewMargin />
            </Page>
        </Document>
    );
};

export default DayOverviewPdf;
