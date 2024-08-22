import { ErrorSecondaryText } from "@/app/errorStylingandMessages";
import Modal from "@/components/Modal/Modal";
import { Centerer, ContentDiv, OutsideDiv } from "@/components/Modal/ModalFormStyles";
import { Suspense } from "react";
import ExpandedParcelDetails from "../ExpandedParcelDetails";
import ExpandedParcelDetailsFallback from "../ExpandedParcelDetailsFallback";
import LinkButton from "@/components/Buttons/LinkButton";
import Icon from "@/components/Icons/Icon";
import { faBoxArchive } from "@fortawesome/free-solid-svg-icons";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useTheme } from "styled-components";
import { SelectedClientDetails } from "./types";

interface ParcelsModalProps {
    router: AppRouterInstance;
    modalIsOpen: boolean;
    setModalIsOpen: (modalIsOpen: boolean) => void;
    selectedParcelId: string | null;
    selectedClientDetails: SelectedClientDetails | null;
    modalErrorMessage: string | null;
}

const ParcelsModal: React.FC<ParcelsModalProps> = (props) => {
    const theme = useTheme();
    return (
        <Modal
            header={
                <>
                    <Icon icon={faBoxArchive} color={theme.primary.largeForeground[2]} /> Parcel
                    Details
                </>
            }
            isOpen={props.modalIsOpen}
            onClose={() => {
                props.setModalIsOpen(false);
                props.router.push("/parcels");
            }}
            headerId="expandedParcelDetailsModal"
            footer={
                <Centerer>
                    <LinkButton link={`/parcels/edit/${props.selectedParcelId}`}>
                        Edit Parcel
                    </LinkButton>
                    {props.selectedClientDetails && (
                        <>
                            <LinkButton
                                link={`/clients?clientId=${props.selectedClientDetails.clientId}`}
                                disabled={!props.selectedClientDetails.isClientActive}
                            >
                                See Client Details
                            </LinkButton>
                            <LinkButton
                                link={`/clients/edit/${props.selectedClientDetails.clientId}`}
                                disabled={!props.selectedClientDetails.isClientActive}
                            >
                                Edit Client Details
                            </LinkButton>
                        </>
                    )}
                </Centerer>
            }
        >
            <OutsideDiv>
                <ContentDiv>
                    <Suspense fallback={<ExpandedParcelDetailsFallback />}>
                        <ExpandedParcelDetails parcelId={props.selectedParcelId} />
                    </Suspense>
                </ContentDiv>
                {props.modalErrorMessage && (
                    <ErrorSecondaryText>{props.modalErrorMessage}</ErrorSecondaryText>
                )}
            </OutsideDiv>
        </Modal>
    );
};

export default ParcelsModal;
