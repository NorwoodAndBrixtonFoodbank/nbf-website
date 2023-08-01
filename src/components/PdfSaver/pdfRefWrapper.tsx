"use client";

import React, { useRef } from "react";
import ExportPdfButton from "@/components/PdfSaver/exportPdfButton";

const PdfWrapper: React.FC<any> = (props) => { // TODO: Change the any
    const pdfRef = useRef(null);
    return (
    <>  
        <ExportPdfButton pdfRef={pdfRef} childComponent={props.children}/>
        <div ref={pdfRef}>
            {props.children}
        </div>
        
    </>
    );
};

export default PdfWrapper;
