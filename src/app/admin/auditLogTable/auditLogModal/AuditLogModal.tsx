import Icon from "@/components/Icons/Icon";
import Modal from "@/components/Modal/Modal";
import { useTheme } from "styled-components";
import { auditLogIcon } from "../../AdminPage";
import { AuditLogRow } from "../types";
import { capitaliseWords } from "@/common/format";

interface AuditLogModalProps {
    modalIsOpen: boolean;
    setModalIsOpen: (modalIsOpen: boolean) => void;
    selectedAuditLog: AuditLogRow | null;
}

const AuditLogModal: React.FC<AuditLogModalProps> = ({modalIsOpen, setModalIsOpen, selectedAuditLog}) => {
    const theme = useTheme();

    return (
    <Modal
                        header={
                            <>
                                <Icon
                                    icon={auditLogIcon}
                                    color={theme.primary.largeForeground[2]}
                                />{" "}
                                {selectedAuditLog?.action ? capitaliseWords(selectedAuditLog?.action) : ""}
                            </>
                        }
                        isOpen={modalIsOpen}
                        onClose={() => {
                            setModalIsOpen(false);
                        }}
                        headerId="auditLogModal"
                    >
                        <></>
                    </Modal>
)}

export default AuditLogModal;