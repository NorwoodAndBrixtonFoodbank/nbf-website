import React from "react";
import { Skeleton } from "@mui/material";
import styled from "styled-components";

const SkeletonKey = styled(Skeleton)`
    display: inline-block;
    border-radius: 0.7em;
    padding: 0.2em 0.5em;
`;

const SkeletonValue = styled(Skeleton)`
    padding: 0.2em 0.5em;
`;

const SkeletonItem = styled.div`
    padding-bottom: 1em;
`;

const SkeletonDiv = styled.div`
    width: 1000px;
    max-width: 100%;
`;

const ExpandedClientDetailsFallback: React.FC<{}> = () => {
    const clientDetailFields = [
        "VOUCHER #",
        "FULL NAME",
        "PHONE NUMBER",
        "PACKING DATE",
        "DELIVERY_INSTRUCTIONS",
        "ADDRESS",
        "HOUSEHOLD",
        "AGE & GENDER OF CHILDREN",
        "DIETARY REQUIREMENTS",
        "FEMININE PRODUCTS",
        "BABY PRODUCTS",
        "PET FOOD",
        "OTHER REQUIREMENTS",
        "EXTRA INFORMATION",
    ];

    return (
        <SkeletonDiv>
            {clientDetailFields.map((field, index) => {
                return (
                    <SkeletonItem key={index}>
                        <SkeletonKey
                            variant="text"
                            width={field.length * 10}
                            sx={{ fontSize: "1rem" }}
                        />
                        <SkeletonValue variant="text" width={200} sx={{ fontSize: "1rem" }} />
                    </SkeletonItem>
                );
            })}
        </SkeletonDiv>
    );
};

export default ExpandedClientDetailsFallback;
