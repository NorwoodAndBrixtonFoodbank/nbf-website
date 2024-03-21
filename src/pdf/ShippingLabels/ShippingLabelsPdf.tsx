import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

export interface ShippingLabelData {
    label_quantity: number;
    parcel_id: string;
    packing_time_of_day: string;
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

const labelSizePixels = { width: mmToPixels(150), height: mmToPixels(62) };

const styles = StyleSheet.create({
    page: {
        padding: "0.2cm",
        fontFamily: "Helvetica",
        fontSize: "11pt",
        lineHeight: 1.25,
    },
    cardWrapper: {
        border: "1.5pt solid black",
        height: "100%",
        display: "flex",
        flexDirection: "column",
    },
    topRow: {
        justifyContent: "flex-start",
        flexBasis: "20%",
        display: "flex",
        flexDirection: "row",
    },
    middleRow: { flex: 1, display: "flex", flexDirection: "row" },
    bottomRow: {
        justifyContent: "flex-end",
        flexBasis: "30%",
        display: "flex",
        flexDirection: "row",
    },
    leftCol: { justifyContent: "flex-start", flexBasis: "36%" },
    middleCol: { flex: 1 },
    rightCol: { justifyContent: "flex-end", flexBasis: "25%" },
    bottomAlign: { marginTop: "auto" },
    headingText: { fontFamily: "Helvetica-Bold", textTransform: "uppercase" },
    largeText: {
        fontSize: "29pt",
        lineHeight: 1,
    },
    mediumText: {
        fontSize: "19pt",
        lineHeight: 1,
    },
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
                <View style={styles.topRow}>
                    <Text style={styles.leftCol}>
                        <Text style={styles.headingText}>Name:</Text>
                        <Text> {data.full_name}</Text>
                    </Text>
                    <Text style={styles.middleCol}>
                        <Text style={styles.headingText}>Contact:</Text>
                        <Text> {data.phone_number}</Text>
                    </Text>
                    <Text style={styles.rightCol}>
                        <Text style={styles.headingText}>Packed:</Text>
                        <Text> {data.packing_time_of_day}</Text>
                    </Text>
                </View>
                <View style={styles.middleRow}>
                    <View style={styles.leftCol}>
                        <Text>
                            {data.address_1}
                            <br />
                        </Text>
                        <Text>
                            {data.address_2}
                            <br />
                        </Text>
                        <Text>
                            {data.address_town}
                            <br />
                        </Text>
                        <Text>
                            {data.address_county}
                            <br />
                        </Text>
                    </View>
                    <View style={styles.middleCol}>
                        <Text style={styles.headingText}>Delivery Instructions:</Text>
                        <Text>{data.delivery_instructions}</Text>
                    </View>
                </View>
                <View style={styles.bottomRow}>
                    <View style={[styles.leftCol, styles.bottomAlign]}>
                        <Text style={styles.largeText}>{data.address_postcode}</Text>
                    </View>
                    <View style={[styles.middleCol, styles.bottomAlign]}>
                        <Text style={styles.mediumText}>
                            {data.packing_time_of_day} |
                            {data.collection_centre !== "DLVR"
                                ? data.collection_centre // TODO VFB-56 needs icon
                                : "Delivery"}
                        </Text>
                    </View>
                    <View style={[styles.rightCol, styles.bottomAlign]}>
                        <Text style={styles.mediumText}>
                            Item {index + 1} of {quantity}
                        </Text>
                    </View>
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
            {data.label_quantity > 0 &&
                [...Array(data.label_quantity)].map((value: undefined, index: number) => {
                    return (
                        <LabelCard
                            key={index} // eslint-disable-line react/no-array-index-key
                            data={data}
                            index={index}
                            quantity={data.label_quantity}
                        />
                    );
                })}
        </Document>
    );
};

export default ShippingLabelsPdf;
