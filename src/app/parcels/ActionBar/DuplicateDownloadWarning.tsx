import React from "react";

import { getParcelsWithEvent } from "@/app/parcels/parcelsTable/fetchParcelTableData";
import Alert from "@mui/material/Alert/Alert";
import styled from "styled-components";
import { StatusType } from "@/app/parcels/ActionBar/Statuses";
import { ParcelsTableRow } from "@/app/parcels/parcelsTable/types";

export interface DuplicateDownloadWarningProps {
    parcels: ParcelsTableRow[];
    targetEventName: StatusType;
}

const StyledAlert = styled(Alert)`
    border-radius: 4px;
`;

const DuplicateDownloadWarning: React.FC<DuplicateDownloadWarningProps> = async (props) => {
    const parcelIds = props.parcels.map((parcel) => parcel.parcelId);
    const { parcels, error } = await getParcelsWithEvent(props.targetEventName, parcelIds);
    if (error) {
        return;
    }

    const postcodes = parcels.map((parcel) => parcel.client_address_postcode);
    const uniquePostcodes = Array.from(new Set(postcodes));

    return (
        uniquePostcodes.length > 0 && (
            <StyledAlert severity="warning">
                The following postcodes have already been downloaded: {uniquePostcodes.join(", ")}.
                Are you sure you want to print again?
            </StyledAlert>
        )
    );
};

export default DuplicateDownloadWarning;
