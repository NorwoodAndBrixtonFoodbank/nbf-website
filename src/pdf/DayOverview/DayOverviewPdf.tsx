"use client";

import React from "react";
import { Svg, Document, Page, Text, View, StyleSheet, Path } from "@react-pdf/renderer";
import { faFlag, faSquare, IconDefinition } from "@fortawesome/free-solid-svg-icons";

import {
    DayOverviewData,
    getCurrentDate,
    ParcelOfSpecificDateAndLocation,
} from "@/pdf/DayOverview/DayOverviewPdfButton";
import { nullPostcodeDisplay } from "@/app/parcels/ParcelsPage";

interface DayOverviewSubtitleProps {
    subtitleKey: string;
    children: string;
}

interface DayOverviewRowProps {
    row: ParcelOfSpecificDateAndLocation;
}

interface DayOverviewContentProps {
    date: Date;
    location: string;
    data: ParcelOfSpecificDateAndLocation[];
}

interface DayOverviewPdfProps {
    data: DayOverviewData;
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
        padding: "0 30pt 15pt",
        fontSize: "11pt",
    },
    title: {
        fontFamily: "Helvetica-Bold",
        textTransform: "uppercase",
        fontSize: "30px",
        textAlign: "center",
        margin: "0 22.5pt 22.5pt",
    },
    subtitleWrap: {
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

const CustomSVG: React.FC<CustomSVGProps> = ({ icon, color, fill }) => {
    const svgPath = icon.icon[4];
    const formattedSvgPath = typeof svgPath === "string" ? svgPath : svgPath[0];

    return (
        <Svg width={11} height={11} viewBox="0 0 512 512" style={styles.svg}>
            <Path
                fill={fill ? color : undefined}
                stroke={color}
                strokeWidth={40}
                d={formattedSvgPath}
            />
        </Svg>
    );
};

const DayOverviewMargin: React.FC<{}> = () => {
    return <View style={styles.margin} fixed></View>;
};

const DayOverviewSubtitle: React.FC<DayOverviewSubtitleProps> = ({ subtitleKey, children }) => (
    <Text>
        <Text style={styles.bold}>{subtitleKey}: </Text>
        {children}
    </Text>
);

const DayOverviewHeader: React.FC<{}> = () => {
    return (
        <View style={[styles.row, styles.bold, { borderTop: "1 solid black" }]} fixed>
            <Text style={[styles.cellLogo, styles.cell]}></Text>
            <Text style={[styles.cellName, styles.cell]}>Name</Text>
            <Text style={[styles.cellPostcode, styles.cell]}>Postcode</Text>
            <Text style={[styles.cellTime, styles.cell]}>Time</Text>
            <Text style={[styles.cellInstructions, styles.cell]}>Instructions</Text>
        </View>
    );
};

const DayOverviewRow: React.FC<DayOverviewRowProps> = ({ row }) => {
    return (
        <View style={styles.row} wrap={false}>
            <View style={[styles.cellLogo, styles.cell, styles.row]}>
                <CustomSVG icon={faSquare} color="black" fill={false} />
                {row.clients!.flagged_for_attention && (
                    <CustomSVG icon={faFlag} color="orange" fill={true} />
                )}
            </View>
            <Text style={[styles.cellName, styles.cell]}>{row.clients!.full_name}</Text>
            <Text style={[styles.cellPostcode, styles.cell]}>
                {row.clients!.address_postcode ?? nullPostcodeDisplay}
            </Text>
            <Text style={[styles.cellTime, styles.cell]}>
                {dateTimeToAMPM(row.collection_datetime!)}
            </Text>
            <Text style={[styles.cellInstructions, styles.cell]}>
                {row.clients!.delivery_instructions}
            </Text>
        </View>
    );
};

const DayOverviewContent: React.FC<DayOverviewContentProps> = ({ date, location, data }) => {
    return (
        <>
            <View style={[styles.subtitleWrap, styles.row]}>
                <DayOverviewSubtitle subtitleKey="Date">
                    {getCurrentDate(date, true)}
                </DayOverviewSubtitle>
                <DayOverviewSubtitle subtitleKey="Location">{location}</DayOverviewSubtitle>
            </View>
            <View style={{ borderLeft: "1 solid black" }}>
                <DayOverviewHeader />
                {data.map((datum, index) => (
                    <DayOverviewRow key={index} row={datum} /> // eslint-disable-line react/no-array-index-key
                ))}
            </View>
        </>
    );
};

const DayOverviewPdf: React.FC<DayOverviewPdfProps> = ({ data }) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <DayOverviewMargin />
                <Text style={styles.title}>Day Overview</Text>
                <DayOverviewContent date={data.date} location={data.location} data={data.data} />
                <DayOverviewMargin />
            </Page>
        </Document>
    );
};

export default DayOverviewPdf;
