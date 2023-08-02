import React from "react";
import Modal from "@/components/Modal/Modal";
import { Skeleton } from "@mui/material";
import Icon from "@/components/Icons/Icon";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

interface Props {
    parcelId: string | null;
    onClose: () => void;
}

// TODO Improve Fallback Visuals
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

const ExpandedClientDetailsFallback: React.FC<Props> = (props) => {
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
        <Modal
            header={
                <>
                    <Icon icon={faUser} /> Client Details
                </>
            }
            isOpen={props.parcelId !== null}
            onClose={props.onClose}
            headerId="expandedClientDetailsModal"
        >
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
        </Modal>
    );
};

export default ExpandedClientDetailsFallback;
