import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DbWikiRow } from "@/databaseUtils";

interface AccordianProps {
    topRow: DbWikiRow;
    formattedContent: (string | React.JSX.Element)[];
}

const WikiAccordian: React.FC<AccordianProps> = (props) => {
    return (
        <>
            {props.topRow.order !== -1 && (
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                    >
                        {props.topRow.title}
                    </AccordionSummary>
                    <AccordionDetails>{props.formattedContent}</AccordionDetails>
                </Accordion>
            )}
        </>
    );
};

export default WikiAccordian;
