"use client";

import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

export interface ParcelClients {
    packing_datetime: string;
    collection_centre: string;
    collection_datetime: string;
    voucher_number: string;
    full_name?: string;
    phone_number?: string;
    address_1?: string;
    address_2?: string;
    address_town?: string;
    address_county?: string;
    address_postcode?: string;
    delivery_instructions?: string;
}

const styles = StyleSheet.create({
    page: {
        display: "flex",
        flexDirection: "column",
        fontSize: "11pt",
    },
    cardWrapper: { border: "1pt solid black", margin: 10 },
    heading: { fontFamily: "Helvetica-Bold", textTransform: "uppercase" },
    row: { display: "flex", flexDirection: "row" },
    col: { flex: 1, margin: 5 },
});

interface ParcelCardProps {
    datum: ParcelClients;
    index: number;
    total: number;
}

const ParcelCard: React.FC<ParcelCardProps> = ({ datum, index, total }) => {
    return (
        <View style={styles.cardWrapper} wrap={false}>
            <View style={styles.row}>
                <Text style={styles.col}>
                    <Text style={styles.heading}>name:</Text> {datum.full_name}
                </Text>
                <Text style={styles.col}>
                    <Text style={styles.heading}>contact:</Text> {datum.phone_number}
                </Text>
                <Text style={[styles.col, { textAlign: "right" }]}>
                    <Text style={styles.heading}>packed:</Text> {datum.packing_datetime}
                </Text>
            </View>
            <View style={[styles.row, { minHeight: 100 }]}>
                <View style={styles.col}>
                    <Text>{datum.address_1}</Text>
                    <Text>{datum.address_2}</Text>
                    <Text>{datum.address_town}</Text>
                    <Text>{datum.address_county}</Text>
                    <Text>{datum.address_postcode}</Text>
                </View>
                <View style={styles.col}>
                    <Text style={styles.heading}>delivery instructions:</Text>
                    <Text>{datum.delivery_instructions}</Text>
                </View>
                <View style={styles.col}></View>
            </View>
            <View style={styles.row}>
                <Text style={styles.col}>
                    <Text style={styles.heading}>{datum.voucher_number}</Text>
                </Text>
                <Text style={styles.col}>
                    {datum.collection_datetime} | {datum.collection_centre}
                </Text>
                <Text style={[styles.col, { textAlign: "right" }]}>
                    {index + 1}/{total}
                </Text>
            </View>
        </View>
    );
};

export interface ShippingLabelsPdfProps {
    data: ParcelClients[];
}

const ShippingLabelsPdf: React.FC<ShippingLabelsPdfProps> = ({ data }) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {data.map((datum, datumIndex) => {
                    return (
                        <ParcelCard
                            key={datumIndex}
                            datum={datum}
                            index={datumIndex}
                            total={data.length}
                        />
                    );
                })}
            </Page>
        </Document>
    );
};

export default ShippingLabelsPdf;
