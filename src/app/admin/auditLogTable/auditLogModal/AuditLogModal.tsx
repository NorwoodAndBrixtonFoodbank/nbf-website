"use client";

import React from "react";
import Icon from "@/components/Icons/Icon";
import Modal from "@/components/Modal/Modal";
import styled, { useTheme } from "styled-components";
import { auditLogIcon } from "../../AdminPage";
import { AuditLogRow } from "../types";
import { capitaliseWords, formatJson } from "@/common/format";
import CollectionCentreName from "./auditLogModalRows/CollectionCentreName";
import ParcelLink from "./auditLogModalRows/ParcelLink";
import ClientLink from "./auditLogModalRows/ClientLink";
import ListsIngredientName from "./auditLogModalRows/ListsIngredientName";
import EventName from "./auditLogModalRows/EventName";
import ListsHotelIngredientName from "./auditLogModalRows/ListsHotelIngredientName";
import ProfileName from "./auditLogModalRows/ProfileName";
import PackingSlotName from "./auditLogModalRows/PackingSlotName";
import StatusOrderEventName from "./auditLogModalRows/StatusOrderEventName";
import WebsiteDataName from "./auditLogModalRows/WebsiteDataName";
import { AuditLogModalItem, Key, TextValueContainer } from "./AuditLogModalRow";

export const AuditLogModalContainer = styled.div`
    width: 800px;
    max-width: 100%;

    display: flex;
    flex-direction: column;
`;

interface AuditLogModalProps {
    modalIsOpen: boolean;
    setModalIsOpen: (modalIsOpen: boolean) => void;
    selectedAuditLogRow: AuditLogRow | null;
}

const AuditLogModal: React.FC<AuditLogModalProps> = ({
    modalIsOpen,
    setModalIsOpen,
    selectedAuditLogRow,
}) => {
    const theme = useTheme();

    return (
        <Modal
            header={
                <>
                    <Icon icon={auditLogIcon} color={theme.primary.largeForeground[2]} />
                    {selectedAuditLogRow?.action
                        ? capitaliseWords(selectedAuditLogRow?.action)
                        : ""}
                </>
            }
            isOpen={modalIsOpen}
            onClose={() => {
                setModalIsOpen(false);
            }}
            headerId="auditLogModal"
        >
            {selectedAuditLogRow && (
                <AuditLogModalContainer>
                    {selectedAuditLogRow.parcelId && (
                        <ParcelLink parcelId={selectedAuditLogRow.parcelId} />
                    )}
                    {selectedAuditLogRow.clientId && (
                        <ClientLink clientId={selectedAuditLogRow.clientId} />
                    )}
                    {selectedAuditLogRow.collectionCentreId && (
                        <CollectionCentreName
                            collectionCentreId={selectedAuditLogRow.collectionCentreId}
                        />
                    )}
                    {selectedAuditLogRow.eventId && (
                        <EventName eventId={selectedAuditLogRow.eventId} />
                    )}
                    {selectedAuditLogRow.profileId && (
                        <ProfileName profileId={selectedAuditLogRow.profileId} />
                    )}
                    {selectedAuditLogRow.listId && (
                        <ListsIngredientName listsId={selectedAuditLogRow.listId} />
                    )}
                    {selectedAuditLogRow.listHotelId && (
                        <ListsHotelIngredientName listsHotelId={selectedAuditLogRow.listHotelId} />
                    )}
                    {selectedAuditLogRow.packingSlotId && (
                        <PackingSlotName packingSlotId={selectedAuditLogRow.packingSlotId} />
                    )}
                    {selectedAuditLogRow.statusOrder && (
                        <StatusOrderEventName
                            statusOrderEventName={selectedAuditLogRow.statusOrder}
                        />
                    )}
                    {selectedAuditLogRow.websiteData && (
                        <WebsiteDataName websiteDataName={selectedAuditLogRow.websiteData} />
                    )}
                    <AuditLogModalItem>
                        <Key>ACTION CONTENT: </Key>
                        <TextValueContainer>
                            {formatJson(selectedAuditLogRow.content)}
                        </TextValueContainer>
                    </AuditLogModalItem>
                </AuditLogModalContainer>
            )}
        </Modal>
    );
};

export default AuditLogModal;
