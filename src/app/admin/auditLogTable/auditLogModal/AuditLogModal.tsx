"use client";

import React from "react";
import Icon from "@/components/Icons/Icon";
import Modal from "@/components/Modal/Modal";
import styled, { useTheme } from "styled-components";
import { auditLogIcon } from "../../AdminPage";
import { AuditLogRow } from "../types";
import { getParcelInfo } from "./getParcelInfo";
import { capitaliseWords } from "@/common/format";
import ClientLink from "./ClientLink";
import CollectionCentreName from "./CollectionCentreName";

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
`;

export const LinkContainer = styled.div`
    padding: 0rem 0.5rem;
`;

export const TextValueContainer = styled.div`
    padding: 1rem 0.5rem;
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
                {selectedAuditLogRow?.parcelId && 
                    getParcelInfo(selectedAuditLogRow.parcelId)
                }
                {selectedAuditLogRow?.clientId && (
                    <ClientLink clientId={selectedAuditLogRow.clientId} />
                )}
                {selectedAuditLogRow?.collectionCentreId && (
                    <CollectionCentreName collectionCentreId={selectedAuditLogRow.collectionCentreId} />
                )}
            </AuditLogModalContainer>
        </Modal>
    );
};

export default AuditLogModal;
