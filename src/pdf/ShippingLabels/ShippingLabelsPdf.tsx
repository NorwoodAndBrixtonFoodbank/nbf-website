"use client";

import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

export interface ShippingLabelData {
    labelQuantity: number;
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

const mmToPixels = (mm: number): number => {
    const pixelsPerMmAt72Dpi = 72 / 25.4;
    return mm * pixelsPerMmAt72Dpi;
};

const labelSizePixels = { width: mmToPixels(200), height: mmToPixels(63) };

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

interface LabelCardProps {
    data: ShippingLabelData;
    index: number;
    quantity: number;
}

const LabelCard: React.FC<LabelCardProps> = ({ data, index, quantity }) => {
    return (
        <Page size={labelSizePixels} style={styles.page}>
            <View style={styles.cardWrapper} wrap={false}>
                <View style={styles.row}>
                    <Text style={styles.col}>
                        <Text style={styles.heading}>name:</Text> {data.full_name}
                    </Text>
                    <Text style={styles.col}>
                        <Text style={styles.heading}>contact:</Text> {data.phone_number}
                    </Text>
                    <Text style={[styles.col, { textAlign: "right" }]}>
                        <Text style={styles.heading}>packed:</Text> {data.packing_datetime}
                    </Text>
                </View>
                <View style={[styles.row, { minHeight: 100 }]}>
                    <View style={styles.col}>
                        <Text>{data.address_1}</Text>
                        <Text>{data.address_2}</Text>
                        <Text>{data.address_town}</Text>
                        <Text>{data.address_county}</Text>
                        <Text>{data.address_postcode}</Text>
                    </View>
                    <View style={styles.col}>
                        <Text style={styles.heading}>delivery instructions:</Text>
                        <Text>{data.delivery_instructions}</Text>
                    </View>
                    <View style={styles.col}></View>
                </View>
                <View style={styles.row}>
                    <Text style={styles.col}>
                        <Text style={styles.heading}>{data.voucher_number}</Text>
                    </Text>
                    <Text style={styles.col}>
                        {data.collection_datetime} | {data.collection_centre}
                    </Text>
                    <Text style={[styles.col, { textAlign: "right" }]}>
                        {index + 1}/{quantity}
                    </Text>
                </View>
            </View>
        </Page>
    );
};

export interface ShippingLabelsPdfProps {
    data: ShippingLabelData;
}

const ShippingLabelsPdf: React.FC<ShippingLabelsPdfProps> = ({ data }) => {
    return (
        <Document>
            {data.labelQuantity > 0 &&
                [...Array(data.labelQuantity)].map((value: undefined, index: number) => {
                    return (
                        <LabelCard
                            key={index}
                            data={data}
                            index={index}
                            quantity={data.labelQuantity}
                        />
                    );
                })}
        </Document>
    );
};

export default ShippingLabelsPdf;
