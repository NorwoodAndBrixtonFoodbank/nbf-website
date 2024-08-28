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

// The height is a hard requirement, fixed at 62mm, the width is technically adjustable but preferred at 150mm
const LABEL_SIZE_MM = { width: 150, height: 62 };

const pixelsPerMmAt72Dpi = 72 / 25.4;

const LABEL_SIZE_PIXELS = {
    width: LABEL_SIZE_MM.width * pixelsPerMmAt72Dpi,
    height: LABEL_SIZE_MM.height * pixelsPerMmAt72Dpi,
};

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
        flexDirection: "row",
        padding: "0.2cm",
    },
    firstRow: {
        justifyContent: "space-between",
        display: "flex",
        flexDirection: "row",
        maxHeight: "38%",
    },
    secondRow: { display: "flex" },
    thirdRow: { flex: 1, display: "flex", flexDirection: "column" },
    fourthRow: {
        display: "flex",
        flexDirection: "row",
    },
    leftCol: { flexBasis: "32%", textAlign: "left" },
    middleCol: { flex: 1, textAlign: "left" },
    headingText: { fontFamily: "Helvetica-Bold", textTransform: "uppercase" },
    largeText: {
        fontSize: "26pt",
        lineHeight: 1,
    },
    mediumText: {
        fontSize: "19pt",
        lineHeight: 1,
    },
    fullNameText: { display: "flex", flexDirection: "row", flexWrap: "wrap", maxWidth: "100%" },
    deliveryInstructionText: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
    },
});

interface LabelCardProps {
    data: ShippingLabelData;
    index: number;
    quantity: number;
}

const convertDateFormat = (date: string): string => {
    const dateArray = date.split("-");
    return `${dateArray[2]}/${dateArray[1]}/${dateArray[0]}`;
};

const SingleLabelCard: React.FC<LabelCardProps> = ({ data, index, quantity }) => {
    return (
        <Page size={LABEL_SIZE_PIXELS} style={styles.page}>
            <View style={styles.cardWrapper} wrap={true}>
                <View style={[styles.leftCol, { flexDirection: "column", marginRight: "3px" }]}>
                    <View style={styles.firstRow}>
                        <Text style={[styles.headingText, { flexWrap: "wrap" }]}>Name: </Text>
                    </View>
                    <View style={[styles.secondRow, { marginBottom: "10px" }]}>
                        <Text style={[styles.fullNameText, { flexWrap: "wrap" }]}>
                            {data.full_name}
                        </Text>
                    </View>
                    <View style={styles.thirdRow}>
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
                    <View style={styles.fourthRow}>
                        <Text style={styles.largeText}>
                            {data.address_postcode ?? displayPostcodeForHomelessClient}
                        </Text>
                    </View>
                </View>
                <View style={[styles.middleCol, { flexDirection: "column" }]}>
                    <View style={styles.firstRow}>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={styles.headingText}>Contact: </Text>
                            <Text>{data.phone_number}</Text>
                        </View>
                        <Text style={styles.headingText}>Packed:</Text>
                    </View>
                    <View
                        style={[
                            styles.secondRow,
                            {
                                justifyContent: "space-between",
                                flexDirection: "row",
                            },
                        ]}
                    >
                        <Text style={[styles.headingText, { right: 0 }]}>
                            Delivery Instructions:{" "}
                        </Text>
                        <Text>{convertDateFormat(data.packing_date)}</Text>
                    </View>
                    <View style={styles.thirdRow}>
                        <Text style={styles.deliveryInstructionText}>
                            {data.delivery_instructions}
                        </Text>
                    </View>
                    <View
                        style={[styles.fourthRow, { bottom: 0, justifyContent: "space-between" }]}
                    >
                        <View style={{ flexDirection: "row", alignItems: "center", bottom: 0 }}>
                            <Text style={styles.mediumText}>{data.packing_slot} </Text>
                            <Text style={{ fontWeight: "bold", fontSize: "20pt" }}>|</Text>
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
                        <View style={{ right: 0, alignSelf: "center", bottom: 0 }}>
                            <Text style={styles.mediumText}>
                                {index + 1} of {quantity}
                            </Text>
                        </View>
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
