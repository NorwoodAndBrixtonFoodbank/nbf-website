import React from "react";
import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import { ClientSummary, RequirementSummary } from "@/common/formatClientsData";
import { HouseholdSummary } from "@/common/formatFamiliesData";
import { formatCamelCaseKey } from "@/common/format";
import { ParcelInfo } from "@/pdf/ShoppingList/getParcelsData";
import { Item, ShoppingListPdfData } from "@/pdf/ShoppingList/shoppingListPdfDataProps";
import { nullPostcodeDisplay } from "@/app/parcels/ParcelsPage";

export type BlockProps = ParcelInfo | HouseholdSummary | RequirementSummary;

const styles = StyleSheet.create({
    paper: {
        marginLeft: "0.75in",
        marginRight: "0.75in",
        lineHeight: "1.5pt",
    },
    flexRow: {
        display: "flex",
        flexDirection: "row",
    },
    flexColumn: {
        display: "flex",
        flexDirection: "column",
        padding: "5pt",
    },
    pdfHeader: {
        justifyContent: "space-between",
    },
    logoStyling: {
        maxWidth: "20%",
        alignSelf: "center",
    },
    infoBlock: {
        borderStyle: "solid",
        border: "1pt",
        borderBottom: "0",
    },
    infoCell: {
        width: "50%",
        padding: "5pt",
    },
    tableRow: {
        borderStyle: "solid",
        border: "1pt",
        paddingVertical: "4pt",
        textAlign: "center",
    },
    tableItemDescription: {
        width: "25%",
    },
    tableQuantity: {
        width: "35%",
    },
    tableNotes: {
        width: "30%",
    },
    tableDone: {
        width: "10%",
    },
    title: {
        fontSize: "30pt",
        fontFamily: "Helvetica-Bold",
    },
    subtitle: {
        fontSize: "24pt",
        fontFamily: "Helvetica",
    },
    keyText: {
        fontSize: "12pt",
        fontFamily: "Helvetica-Bold",
    },
    normalText: {
        fontSize: "12pt",
        fontFamily: "Helvetica",
    },
    inputText: {
        paddingTop: "20pt",
    },
    checkBox: {
        alignSelf: "center",
        width: "18pt",
        height: "18pt",
        borderStyle: "solid",
        border: "1pt",
    },
});

interface OneLineProps {
    header: string;
    value: string;
}

const OneLine: React.FC<OneLineProps> = ({ header, value }) => {
    return (
        <Text style={styles.keyText}>
            {header}: <Text style={styles.normalText}>{value}</Text>
        </Text>
    );
};

const TableHeadings: React.FC<{}> = () => {
    return (
        <View style={[styles.flexRow, styles.tableRow]}>
            <View style={styles.tableItemDescription}>
                <Text style={styles.keyText}>Item Description</Text>
            </View>
            <View style={styles.tableQuantity}>
                <Text style={styles.keyText}>Quantity</Text>
            </View>
            <View style={styles.tableNotes}>
                <Text style={styles.keyText}>Notes</Text>
            </View>
            <View style={styles.tableDone}>
                <Text style={styles.keyText}>Done</Text>
            </View>
        </View>
    );
};

const ItemToRow: React.FC<Item> = (item) => {
    return (
        <View style={[styles.flexRow, styles.tableRow]} wrap={false}>
            <View style={styles.tableItemDescription}>
                <Text style={styles.normalText}>{item.description}</Text>
            </View>
            <View style={styles.tableQuantity}>
                <Text style={styles.normalText}>{item.quantity}</Text>
            </View>
            <View style={styles.tableNotes}>
                <Text style={styles.normalText}>{item.notes}</Text>
            </View>
            <View style={styles.tableDone}>
                <View style={styles.checkBox} />
            </View>
        </View>
    );
};

interface DisplayItemsListProps {
    itemsList: Item[];
}

const DisplayItemsList: React.FC<DisplayItemsListProps> = ({ itemsList }) => {
    return (
        <View>
            {itemsList.map((item, index) => (
                <ItemToRow {...item} key={index} /> // eslint-disable-line react/no-array-index-key
            ))}
        </View>
    );
};

const DisplayAsBlock: React.FC<BlockProps> = (data: BlockProps) => {
    return (
        <View style={styles.infoCell}>
            {Object.entries(data).map(([propKey, propValue]) => (
                <OneLine key={propKey} header={formatCamelCaseKey(propKey)} value={propValue} />
            ))}
        </View>
    );
};

interface FormatClientCellProps {
    propKey: string;
    propValue: string;
}

const FormatClientCell: React.FC<FormatClientCellProps> = ({ propKey, propValue }) => {
    return (
        <View style={styles.infoCell}>
            <OneLine header={formatCamelCaseKey(propKey)} value={propValue} />
        </View>
    );
};

const DisplayClientSummary: React.FC<ClientSummary> = (clientSummary) => {
    return (
        <>
            <View style={[styles.flexRow, styles.infoBlock]}>
                <FormatClientCell propKey="name" propValue={clientSummary.name} />
                <FormatClientCell propKey="contact" propValue={clientSummary.contact} />
            </View>
            <View style={[styles.flexRow, styles.infoBlock]}>
                <FormatClientCell propKey="address" propValue={clientSummary.address} />
                <FormatClientCell
                    propKey="extraInformation"
                    propValue={clientSummary.extraInformation}
                />
            </View>
        </>
    );
};

interface SingleShoppingListProps {
    parcelData: ShoppingListPdfData;
}

const SingleShoppingList: React.FC<SingleShoppingListProps> = ({ parcelData }) => {
    return (
        <Page size="A4">
            <View style={{ height: "0.75in" }} fixed />
            <View style={styles.paper}>
                <View style={[styles.flexRow, styles.pdfHeader]}>
                    <View style={styles.flexColumn}>
                        <Text style={styles.title}>Shopping List</Text>
                        <Text style={styles.subtitle}>
                            POSTCODE: {parcelData.postcode ?? nullPostcodeDisplay}
                        </Text>
                    </View>
                    {/* eslint-disable-next-line jsx-a11y/alt-text -- React-PDF Image doesn't  have alt text property*/}
                    <Image src="/logo.png" style={[styles.flexRow, styles.logoStyling]} />
                </View>
                <DisplayAsBlock {...parcelData.parcelInfo} />
                <DisplayClientSummary {...parcelData.clientSummary} />
                <View style={[styles.flexRow, styles.infoBlock]}>
                    <DisplayAsBlock {...parcelData.householdSummary} />
                    <DisplayAsBlock {...parcelData.requirementSummary} />
                </View>
                <View>
                    <TableHeadings />
                    <DisplayItemsList itemsList={parcelData.itemsList} />
                </View>
                <View style={styles.flexColumn} wrap={false}>
                    <Text style={[styles.keyText, { paddingTop: "5pt" }]}>
                        Warehouse Manager Notes
                    </Text>
                    <Text style={styles.normalText}>{parcelData.endNotes}</Text>
                    <Text style={[styles.keyText, styles.inputText]}>Date Packed:</Text>
                    <Text style={[styles.keyText, styles.inputText]}>Packer Name:</Text>
                    <Text style={[styles.keyText, styles.inputText]}>Packer Signature:</Text>
                </View>
            </View>
            <View style={{ height: "0.75in" }} fixed />
        </Page>
    );
};

interface ShoppingListPDFProps {
    data: ShoppingListPdfData[];
}

const ShoppingListPdf: React.FC<ShoppingListPDFProps> = ({ data }) => {
    return (
        <Document>
            {data.map((parcelData: ShoppingListPdfData, index: number) => {
                return <SingleShoppingList key={index} parcelData={parcelData} />; // eslint-disable-line react/no-array-index-key
            })}
        </Document>
    );
};

export default ShoppingListPdf;
