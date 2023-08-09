"use client";

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        display: "flex",
        flexDirection: "column",
        fontSize: "11px",
    },
    divider: {
        display: "flex",
        flexDirection: "row",
    },
    flexElemRight: {
        flexGrow: 1,
        border: "1pt solid black",
        textAlign: "right",
    },
    right: {
        textAlign: "right",
    },
    cardWrapper: { border: "1pt solid black", margin: "5px" },
    bold: { fontFamily: "Helvetica-Bold" },
    row: { display: "flex", flexDirection: "row" },
    col: { flex: 1, margin: "5px" },
});

export const Col: React.FC<{ children: React.ReactNode; style?: { [key: string]: string } }> = (
    props
) => {
    return <View style={[styles.col, props.style!]}>{props.children}</View>;
};

export const Row: React.FC<{ children: React.ReactNode; style?: { [key: string]: string } }> = (
    props
) => {
    return <View style={[styles.row, props.style!]}>{props.children}</View>;
};

const ParcelCard = () => {
    return (
        <View style={styles.cardWrapper}>
            <Row>
                <Col>
                    <Text>
                        <Text style={styles.bold}>NAME:</Text> Harry Potter
                    </Text>
                </Col>
                <Col>
                    <Text style={styles.bold}>CONTACT: 07894561230</Text>
                </Col>
                <Col style={{ textAlign: "right" }}>
                    <Text>10/10/2024</Text>
                </Col>
            </Row>
            <Row style={{ minHeight: "100px" }}>
                <Col>
                    <Text>Hogwarts Castle</Text>
                    <Text>Highlands</Text>
                    <Text>Scottland</Text>
                    <Text>Great Britain</Text>
                    <Text>HC1 1DD</Text>
                </Col>
                <Col>
                    <Text style={styles.bold}>DELIVERY INSTRUCTIONS:</Text>
                    <Text>Send by owls only. Floo powders are forbidden in the castle.</Text>
                </Col>
                <Col>
                    <></>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Text>
                        <Text style={styles.bold}>SOMEVOUCHERCODE</Text>
                    </Text>
                </Col>
                <Col>
                    <Text>AM | Delivery</Text>
                </Col>
                <Col style={{ textAlign: "right" }}>
                    <Text>1/1</Text>
                </Col>
            </Row>
        </View>
    );
};

const example = () => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <ParcelCard />
                <ParcelCard />
                <ParcelCard />
                <ParcelCard />
                <ParcelCard />
            </Page>
            <Page size="A4" style={styles.page}>
                <ParcelCard />
                <ParcelCard />
                <ParcelCard />
                <ParcelCard />
                <ParcelCard />
            </Page>
        </Document>
    );
};

export default example;
