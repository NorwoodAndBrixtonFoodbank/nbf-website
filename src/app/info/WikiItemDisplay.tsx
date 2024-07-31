"use client";

import { DbWikiRow } from "@/databaseUtils";
import {
    WikiItemAccordionSurface,
    WikiItemDetailsTextBreaker,
    WikiUpdateDataButton,
} from "@/app/info/StyleComponents";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { convertContentToElements } from "@/app/info/WikiItems";
import AdminManagerDependentView from "@/app/info/AdminManagerDependentView";
import EditIcon from "@mui/icons-material/Edit";

interface DefaultViewProps {
    rowData: DbWikiRow;
    openEditMode: () => void;
}

const WikiItemDisplay: React.FC<DefaultViewProps> = ({ rowData, openEditMode }) => {
    return (
        <>
            <AdminManagerDependentView>
                <WikiUpdateDataButton
                    onClick={() => {
                        openEditMode();
                    }}
                >
                    <EditIcon />
                </WikiUpdateDataButton>
            </AdminManagerDependentView>
            <WikiItemAccordionSurface>
                <Accordion elevation={0}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                    >
                        <h2>{rowData.title}</h2>
                    </AccordionSummary>
                    <AccordionDetails>
                        <WikiItemDetailsTextBreaker>
                            {convertContentToElements(rowData.content)}
                        </WikiItemDetailsTextBreaker>
                    </AccordionDetails>
                </Accordion>
            </WikiItemAccordionSurface>
        </>
    );
};

export default WikiItemDisplay;
