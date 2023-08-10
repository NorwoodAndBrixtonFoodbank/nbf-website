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
    index: number;
    total: number;
}

const styles = StyleSheet.create({
    page: {
        display: "flex",
        flexDirection: "column",
        fontSize: "11px",
    },
    cardWrapper: { border: "1pt solid black", margin: "5px" },
    bold: { fontFamily: "Helvetica-Bold" },
    row: { display: "flex", flexDirection: "row" },
    col: { flex: 1, margin: "5px" },
});

const ParcelCard: React.FC<{ datum: ParcelClients }> = ({ datum }) => {
    return (
        <View style={styles.cardWrapper}>
            <View style={styles.row}>
                <Text style={styles.col}>
                    <Text style={styles.bold}>NAME:</Text> {datum.full_name}
                </Text>
                <Text style={styles.col}>
                    <Text style={styles.bold}>CONTACT:</Text> {datum.phone_number}
                </Text>
                <Text style={[styles.col, { textAlign: "right" }]}>{datum.packing_datetime}</Text>
            </View>
            <View style={[styles.row, { minHeight: "100px" }]}>
                <View style={styles.col}>
                    <Text>{datum.address_1}</Text>
                    <Text>{datum.address_2}</Text>
                    <Text>{datum.address_town}</Text>
                    <Text>{datum.address_county}</Text>
                    <Text>{datum.address_postcode}</Text>
                </View>
                <View style={styles.col}>
                    <Text style={styles.bold}>DELIVERY INSTRUCTIONS:</Text>
                    <Text>{datum.delivery_instructions}</Text>
                </View>
                <View style={styles.col}></View>
            </View>
            <View style={styles.row}>
                <Text style={styles.col}>
                    <Text style={styles.bold}>{datum.voucher_number}</Text>
                </Text>
                <Text style={styles.col}>
                    {datum.collection_datetime} | {datum.collection_centre}
                </Text>
                <Text style={[styles.col, { textAlign: "right" }]}>
                    {datum.index}/{datum.total}
                </Text>
            </View>
        </View>
    );
};

const ShippingLabelsPdf: React.FC<{ data: ParcelClients[][] }> = ({ data }) => {
    return (
        <Document>
            {data.map((subarray, index) => {
                return (
                    <Page key={index} size="A4" style={styles.page}>
                        {subarray.map((datum, datumIndex) => {
                            return <ParcelCard key={datumIndex} datum={datum} />;
                        })}
                    </Page>
                );
            })}
        </Document>
    );
};

export default ShippingLabelsPdf;
