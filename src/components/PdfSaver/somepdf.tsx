"use client";

import React, { useRef } from "react";
import { jsPDF } from "jspdf";

const PdfButton: React.FC<any> = (props) => {
    const savePdf = () => {
        // Default export is a4 paper, portrait, using millimeters for units
        const doc = new jsPDF(
            {
                orientation: 'l',
                unit: 'pt',
                format: 'a0',
                compress: true,
            }
        );

        doc.html(props.pdfRef.current, {
            async callback(doc) {
                await doc.save("document");
            },
        });
    };
    return (
        <>
            {/* <h1 ref={pdfRef}>what</h1> */}
            <button onClick={savePdf}>CLICK ME PLEASE</button>
        </>
    );
};

export default PdfButton;
