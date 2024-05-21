import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { displayPostcodeForHomelessClient } from "@/common/format";
import { faShoePrints, faTruck } from "@fortawesome/free-solid-svg-icons";
import FontAwesomeIconPdfComponent from "@/pdf/FontAwesomeIconPdfComponent";
export interface ShippingLabelData {
    label_quantity: number;
    parcel_id: string;
    packing_date: string;
    packing_slot: string;
    collection_centre: string;
    collection_datetime: string;
    voucher_number: string;
    full_name: string;
    phone_number: string;
    address_1: string;
    address_2: string;
    address_town: string;
    address_county: string;
    address_postcode: string | null;
    delivery_instructions?: string;
}

const mmToPixels = (mm: number): number => {
    const pixelsPerMmAt72Dpi = 72 / 25.4;
    return mm * pixelsPerMmAt72Dpi;
};

const labelSizePixels = { width: mmToPixels(200), height: mmToPixels(62) };

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
        padding: "0.2cm",
    },
    topRow: {
        justifyContent: "space-between",
        flexBasis: "20%",
        display: "flex",
        flexDirection: "row",
    },
    middleRow: { flex: 1, display: "flex", flexDirection: "row" },
    bottomRow: {
        justifyContent: "space-between",
        flexBasis: "30%",
        display: "flex",
        flexDirection: "row",
    },
    leftCol: { flexBasis: "32%", textAlign: "left" },
    middleCol: { flex: 1, textAlign: "left" },
    rightCol: { flexBasis: "28%", textAlign: "right" },
    bottomAlign: { marginTop: "21px" },
    headingText: { fontFamily: "Helvetica-Bold", textTransform: "uppercase" },
    largeText: {
        fontSize: "26pt",
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

const SingleLabelCard: React.FC<LabelCardProps> = ({ data, index, quantity }) => {
    return (
        <Page size={labelSizePixels} style={styles.page}>
            <View style={styles.cardWrapper} wrap={true}>
                <View style={[styles.topRow]}>
                    <View style={[styles.leftCol, { flexDirection: "row" }]}>
                        <Text style={styles.headingText}>Name: </Text>
                        <Text>{data.full_name}</Text>
                    </View>
                    <View style={[styles.middleCol, { flexDirection: "row" }]}>
                        <Text style={styles.headingText}>Contact: </Text>
                        <Text>{data.phone_number}</Text>
                    </View>
                    <View style={[styles.rightCol]}>
                        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                            <Text style={[styles.headingText]}>Packed:</Text>
                            <Text> </Text>
                            <Text>{data.packing_date}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.middleRow}>
                    <View style={styles.leftCol}>
                        {data.address_postcode && (
                            <>
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
                            </>
                        )}
                    </View>
                    <View style={styles.middleCol}>
                        <Text style={styles.headingText}>Delivery Instructions: </Text>
                        <Text>{data.delivery_instructions}</Text>
                    </View>
                </View>
                <View style={[styles.bottomRow]}>
                    <View style={[styles.leftCol, { marginTop: "15px" }]}>
                        <Text style={styles.largeText}>
                            {data.address_postcode ?? displayPostcodeForHomelessClient}
                        </Text>
                    </View>
                    <View style={[styles.middleCol, { flexDirection: "row" }]}>
                        <View style={[styles.bottomAlign]}>
                            <Text style={styles.mediumText}>{data.packing_slot} </Text>
                        </View>
                        <View style={{ marginTop: "auto" }}>
                            <Text style={{ fontWeight: "bold", fontSize: "25pt" }}>|</Text>
                        </View>
                        <View style={[styles.bottomAlign, { flexDirection: "row" }]}>
                            <Text style={styles.mediumText}>
                                {" "}
                                {data.collection_centre === "DLVR"
                                    ? "Delivery "
                                    : data.collection_centre + " "}
                            </Text>
                            <FontAwesomeIconPdfComponent
                                faIcon={data.collection_centre === "DLVR" ? faTruck : faShoePrints}
                            ></FontAwesomeIconPdfComponent>
                        </View>
                    </View>
                    <View style={[styles.rightCol, styles.bottomAlign]}>
                        <Text style={styles.mediumText}>
                            {index + 1} of {quantity}
                        </Text>
                    </View>
                </View>
            </View>
        </Page>
    );
};

export interface ShippingLabelsPdfProps {
    data: ShippingLabelData[];
}

interface ShippingLabelsForSingleParcelProps {
    parcelDataForShippingLabel: ShippingLabelData;
}

const ShippingLabelsForSingleParcel: React.FC<ShippingLabelsForSingleParcelProps> = ({
    parcelDataForShippingLabel,
}) => {
    return (
        parcelDataForShippingLabel.label_quantity > 0 &&
        [...Array(parcelDataForShippingLabel.label_quantity)].map((_, index: number) => {
            return (
                <SingleLabelCard
                    key={index} // eslint-disable-line react/no-array-index-key
                    data={parcelDataForShippingLabel}
                    index={index}
                    quantity={parcelDataForShippingLabel.label_quantity}
                />
            );
        })
    );
};

const ShippingLabelsPdf: React.FC<ShippingLabelsPdfProps> = ({ data }) => {
    return (
        <Document>
            {data.map((parcelData: ShippingLabelData, index) => {
                return (
                    <ShippingLabelsForSingleParcel
                        parcelDataForShippingLabel={parcelData}
                        // eslint-disable-next-line react/no-array-index-key
                        key={index}
                    />
                );
            })}
        </Document>
    );
};

export default ShippingLabelsPdf;
