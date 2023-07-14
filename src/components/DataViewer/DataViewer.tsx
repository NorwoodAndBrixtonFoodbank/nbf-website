import React, { ReactElement } from "react";
import styled from "styled-components";
import Modal from "react-modal";
import CloseIcon from "@mui/icons-material/Close";
interface DataViewerProps {
    data: { [key: string]: string | number | null };
    header: ReactElement | string;
    isOpen: boolean;
    onRequestClose: () => void;
}
const StyledModal = styled(Modal)`
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 0;
    border-radius: 5px;
    outline: none;
    padding: 0;
    width: 80%;
    max-height: 80%;
    background: rgb(255, 255, 255);
    box-shadow: rgb(200, 200, 200) 0 2px 10px;
    overflow: hidden;
`;
const Header = styled.h3`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #eeeeee;
    padding: 0.5rem;
    margin-top: 0;
`;
const Content = styled.div`
    overflow: scroll;
    margin: 1.5rem;
    margin-top: 1rem;
`;
const Key = styled.div`
    color: grey;
    font-size: small;
`;
const Value = styled.div`
    font-size: medium;
`;
const EachItem = styled.div`
    padding-bottom: 1rem;
`;
const CloseButton = styled.button`
    border: 0;
    background-color: red;
    color: white;
    display: flex;
    justify-content: center;
`;
interface ClearButtonProps {
    closeModal: () => void;
}
const ClearButton: React.FC<ClearButtonProps> = (props) => {
    return (
        <CloseButton onClick={props.closeModal}>
            <CloseIcon />
        </CloseButton>
    );
};
const JSONContent: React.FC<{ [key: string]: string | number | null }> = (data) => {
    return Object.entries(data).map(([key, value]) => {
        return (
            <EachItem key={key}>
                <Key>{key.toUpperCase().replace("_", " ")}</Key>
                <Value>{value ?? ""}</Value>
            </EachItem>
        );
    });
};
const DataViewer: React.FC<DataViewerProps> = (props) => {
    const closeModal: () => void = () => {
        props.onRequestClose();
    };
    if (!props.isOpen) {
        return <></>;
    }
    return (
        <StyledModal
            isOpen={true}
            onRequestClose={closeModal}
            ariaHideApp={false}
            contentLabel="Data viewer"
        >
            <Header>
                {props.header}
                <ClearButton closeModal={closeModal} />
            </Header>
            <Content>{JSONContent(props.data)}</Content>
        </StyledModal>
    );
};
export default DataViewer;
