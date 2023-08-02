import React from "react";
import Modal from "@/components/Modal/Modal";
import DataViewer from "@/components/DataViewer/DataViewer";
import { getExpandedClientDetails } from "@/app/clients/getExpandedClientDetails";
import Icon from "@/components/Icons/Icon";
import { faUser } from "@fortawesome/free-solid-svg-icons";

interface Props {
    parcelId: string | null;
    onClose: () => void;
}

const ExpandedClientDetailsModal = async (props: Props): Promise<React.ReactElement> => {
    if (props.parcelId === null) {
        return <></>;
    }

    const expandedClientDetails = await getExpandedClientDetails(props.parcelId);

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
            <DataViewer data={expandedClientDetails} />
            {/* PLACEHOLDER FOR STATUS LIST */}
        </Modal>
    );
};

export default ExpandedClientDetailsModal;
