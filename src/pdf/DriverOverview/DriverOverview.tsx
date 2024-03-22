import React from "react";
import supabase from "@/supabaseClient";
import { Schema } from "@/databaseUtils";
import PdfButton from "@/components/PdfButton/PdfButton";
import DriverOverviewPdf, { DriverOverviewTableData } from "@/pdf/DriverOverview/DriverOverviewPdf";
import { DatabaseError } from "@/app/errorClasses";

const formatDatetime = (datetimeString: string | null): Date | null => {
    return datetimeString ? new Date(datetimeString) : null;
};

const getParcelsForDelivery = async (parcelIds: string[]): Promise<Schema["parcels"][]> => {
    const { data, error } = await supabase.from("parcels").select().in("primary_key", parcelIds);
    if (error) {
        throw new DatabaseError("fetch", "parcels");
    }
    return data ?? [];
};

const getClientById = async (clientId: string): Promise<Schema["clients"] | null> => {
    const { data, error } = await supabase
        .from("clients")
        .select()
        .eq("primary_key", clientId)
        .single();
    if (error) {
        throw new DatabaseError("fetch", "clients");
    }
    return data ?? null;
};

const compare = (first: DriverOverviewTableData, second: DriverOverviewTableData): number => {
    if (first.name < second.name) {
        return -1;
    }
    if (first.name > second.name) {
        return 1;
    }
    return 0;
};

const getRequiredData = async (parcelIds: string[]): Promise<DriverOverviewTableData[]> => {
    const clientInformation = [];
    const parcels = await getParcelsForDelivery(parcelIds);
    for (const parcel of parcels) {
        const client = await getClientById(parcel.client_id);
        clientInformation.push({
            name: client?.full_name ?? "",
            address: {
                line1: client?.address_1 ?? "",
                line2: client?.address_2 ?? null,
                town: client?.address_town ?? null,
                county: client?.address_county ?? null,
                postcode: client?.address_postcode ?? "",
            },
            contact: client?.phone_number ?? "",
            packingDate: formatDatetime(parcel.packing_datetime),
            instructions: client?.delivery_instructions ?? "",
        });
    }
    clientInformation.sort(compare);
    return clientInformation;
};

interface Props {
    text: string;
    parcelIds: string[];
    driverName: string;
    date: Date;
}

const DriverOverview = async ({
    text,
    parcelIds,
    driverName,
    date,
}: Props): Promise<React.ReactElement> => {
    const requiredData = await getRequiredData(parcelIds);
    const { data, error } = await supabase
        .from("website_data")
        .select("name, value")
        .eq("name", "driver_overview_message")
        .single();
    const message = error ? "" : data.value;
    const driverOverviewData = {
        driverName: driverName,
        date: date,
        tableData: requiredData,
        message: message,
    };
    return (
        <PdfButton
            text={text}
            fileName="DriverOverview.pdf"
            data={driverOverviewData}
            pdfComponent={DriverOverviewPdf}
        />
    );
};

export default DriverOverview;
