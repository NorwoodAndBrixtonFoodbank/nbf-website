"use client";

import React from "react";
import Icon from "@/components/Icons/Icon";
import Modal from "@/components/Modal/Modal";
import styled, { useTheme } from "styled-components";
import { auditLogIcon } from "../../AdminPage";
import { AuditLogRow } from "../types";
import { capitaliseWords } from "@/common/format";
import CollectionCentreName from "./infoComponentsForForeignTables.tsx/CollectionCentreName";
import ParcelLink from "./infoComponentsForForeignTables.tsx/ParcelLink";
import ClientLink from "./infoComponentsForForeignTables.tsx/ClientLink";
import EventName from "./infoComponentsForForeignTables.tsx/EventName";
import ProfileName from "./infoComponentsForForeignTables.tsx/ProfileName";
import ListsIngredientName from "./infoComponentsForForeignTables.tsx/ListsIngredientName";
import ListsHotelIngredientName from "./infoComponentsForForeignTables.tsx/ListsHotelIngredientName";

export const AuditLogModalContainer = styled.div`
    width: 800px;
    max-width: 100%;

    display: flex;
    flex-direction: column;
`;

export const AuditLogModalItem = styled.div`
    display: flex;
    flex-direction: row;
    padding-bottom: 0.5em;
`;

export const Key = styled.div`
    flex: 0 0 30%;
    font-weight: 600;
    padding: 1rem 0.5em;
    align-content: center;
`;

export const TextValueContainer = styled.div`
    padding: 1rem;
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
            <AuditLogModalContainer>
                {selectedAuditLogRow?.parcelId && (
                    <ParcelLink parcelId={selectedAuditLogRow.parcelId} />
                )}
                {selectedAuditLogRow?.clientId && (
                    <ClientLink clientId={selectedAuditLogRow.clientId} />
                )}
                {selectedAuditLogRow?.collectionCentreId && (
                    <CollectionCentreName
                        collectionCentreId={selectedAuditLogRow.collectionCentreId}
                    />
                )}
                {selectedAuditLogRow?.eventId && (
                    <EventName
                        eventId={selectedAuditLogRow.eventId}
                    />
                )}
                {selectedAuditLogRow?.profileId && (
                    <ProfileName
                        profileId={selectedAuditLogRow.profileId}
                    />
                )}
                {selectedAuditLogRow?.listId && (
                    <ListsIngredientName
                        listsId={selectedAuditLogRow.listId}
                    />
                )}
                {selectedAuditLogRow?.listHotelId && (
                    <ListsHotelIngredientName
                        listsHotelId={selectedAuditLogRow.listHotelId}
                    />
                )}
            </AuditLogModalContainer>
        </Modal>
    );
};

export default AuditLogModal;
