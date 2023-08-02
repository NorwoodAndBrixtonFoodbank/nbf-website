"use client";

import Modal from "@/components/Modal/Modal";
import ExportPdfButton, { PdfProps } from "@/components/PdfSaver/exportPdfButton";
import Table from "@/components/Tables/Table";
import React, { useRef, useState } from "react";
import styled from "styled-components";

const PdfMain = styled.div`
    width: 210mm;
    padding: 1rem 3rem;
`;

const PdfFooter = styled.div`
    padding: 1rem 3rem;
    float: right;
`;

const data = [
    {
        full_name: "Tom",
        phone_number: 123456,
    },
    {
        full_name: "Sam",
        phone_number: 999,
    },
    {
        full_name: "Harper Garrett",
        phone_number: 2171786554,
    },
    {
        full_name: "Adrian Key",
        phone_number: 3650099130,
    },
    {
        full_name: "Harrell Wallace",
        phone_number: 4650047935,
    },
    {
        full_name: "Oneill Curtis",
        phone_number: 7058491995,
    },
    {
        full_name: "Herring Rutledge",
        phone_number: 1440882899,
    },
    {
        full_name: "Eloise Rowland",
        phone_number: 2580325390,
    },
    {
        full_name: "Cathryn Burks",
        phone_number: 7136166489,
    },
    {
        full_name: "Paopao",
        phone_number: 7136166469,
    },
    {
        full_name: "Forbes Doyle",
        phone_number: 1377097191,
    },
    {
        full_name: "Agnes Rosales",
        phone_number: 3334796379,
    },
    {
        full_name: "Jan Orr",
        phone_number: 1526538148,
    },
    {
        full_name: "Colleen Lowery",
        phone_number: 3980156139,
    },
    {
        full_name: "Chloe",
        phone_number: 4567894522,
    },
    {
        full_name: "Tom",
        phone_number: 123456,
    },
    {
        full_name: "Sam",
        phone_number: 999,
    },
    {
        full_name: "Harper Garrett",
        phone_number: 2171786554,
    },
    {
        full_name: "Adrian Key",
        phone_number: 3650099130,
    },
    {
        full_name: "Harrell Wallace",
        phone_number: 4650047935,
    },
    {
        full_name: "Oneill Curtis",
        phone_number: 7058491995,
    },
    {
        full_name: "Herring Rutledge",
        phone_number: 1440882899,
    },
    {
        full_name: "Eloise Rowland",
        phone_number: 2580325390,
    },
    {
        full_name: "Cathryn Burks",
        phone_number: 7136166489,
    },
    {
        full_name: "Paopao",
        phone_number: 7136166469,
    },
    {
        full_name: "Forbes Doyle",
        phone_number: 1377097191,
    },
    {
        full_name: "Agnes Rosales",
        phone_number: 3334796379,
    },
    {
        full_name: "Jan Orr",
        phone_number: 1526538148,
    },
    {
        full_name: "Colleen Lowery",
        phone_number: 3980156139,
    },
    {
        full_name: "Chloe",
        phone_number: 4567894522,
    },
];

const headers = {
    full_name: "Name",
    phone_number: "Phone Number",
    // other1: "other1",
    // other2: "other2",
    // other3: "other3",
    // other4: "other4",
    // other5: "other5",
    // other6: "other6",
};

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
                <Table data={data} headers={headers} />
            </PdfMain>
            <PdfFooter>
                <ExportPdfButton pdfRef={props.pdfRef} />
            </PdfFooter>
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
