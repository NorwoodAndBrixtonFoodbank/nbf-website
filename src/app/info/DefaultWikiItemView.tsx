"use client";

import { DbWikiRow } from "@/databaseUtils";
import { WikiItemAccordionSurface, WikiUpdateDataButton } from "@/app/info/StyleComponents";
import UpdateIcon from "@mui/icons-material/Update";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { convertContentToElements } from "@/app/info/WikiItems";
import AdminManagerDependent from "@/app/info/AdminManagerDependent";

interface DefaultViewProps {
    rowRef?: DbWikiRow;
    setEditModeRef: (editMode: boolean) => void;
}

const DefaultWikiItemView: React.FC<DefaultViewProps> = ({ rowRef, setEditModeRef }) => {
    return (
        <>
            {rowRef && (
                <>
                    <AdminManagerDependent>
                        <WikiUpdateDataButton
                            onClick={() => {
                                setEditModeRef(true);
                            }}
                        >
                            <UpdateIcon />
                        </WikiUpdateDataButton>
                    </AdminManagerDependent>
                    <WikiItemAccordionSurface>
                        <Accordion elevation={0}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                            >
                                <h2>{rowRef.title}</h2>
                            </AccordionSummary>
                            <AccordionDetails>
                                {convertContentToElements(rowRef.content)}
                            </AccordionDetails>
                        </Accordion>
                    </WikiItemAccordionSurface>
                </>
            )}
        </>
    );
};

export default DefaultWikiItemView;
