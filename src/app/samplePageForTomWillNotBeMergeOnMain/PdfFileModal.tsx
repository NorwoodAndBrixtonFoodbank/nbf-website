"use client";

import Modal from "@/components/Modal/Modal";
import ExportPdfButton, { PdfProps } from "@/components/PdfSaver/exportPdfButton";
import React, { useRef, useState } from "react";
import styled from "styled-components";

const PdfMain = styled.div`
    width: 210mm;
    padding: 3rem;
`

const ModalChild: React.FC<PdfProps> = (props) => {
    return (
        <>
            <PdfMain ref={props.pdfRef}>
                <h1>Hot dogs are the best</h1>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                    nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                    fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum.
                </p>
            </PdfMain>
            <ExportPdfButton pdfRef={props.pdfRef} />
        </>
    );
};

const PdfFileModal: React.FC<{}> = () => {
    const pdfRef = useRef<HTMLInputElement | null>(null);
    const [modalOpen, setModalOpen] = useState(true);

    const toggle = (): void => {
        setModalOpen(!modalOpen);
    };

    return (
        <>
            <Modal
                isOpen={modalOpen}
                header={<div>Hot dogs are the best</div>}
                onClose={toggle}
                headerId="RedHot"
            >
                <ModalChild pdfRef={pdfRef} />
            </Modal>
            <button onClick={toggle}>Press Me I am Fun</button>
        </>
    );
};

export default PdfFileModal;
