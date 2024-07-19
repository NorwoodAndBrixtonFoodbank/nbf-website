import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DbWikiRow } from "@/databaseUtils";
import TableSurface from "@/components/Tables/TableSurface";

interface AccordianProps {
    rows: DbWikiRow[];
}

interface ContentPart {
    content: string;
    href?: string;
    key: string;
}

export const convertContentToElements = (rowContent: string): React.JSX.Element[] => {
    const rowContentParts = rowContent.split(/(\[.*\]\(.*\)|<.*>)/);
    const contentParts: ContentPart[] = rowContentParts.map((part, index) => {
        if (index % 2 === 1) {
            const plainPart = part.slice(1, -1);
            if (plainPart.includes("](")) {
                const items = plainPart.split(/\]\(/);
                return { content: items[0], href: items[1], key: crypto.randomUUID() };
            } else {
                return { content: plainPart, href: plainPart, key: crypto.randomUUID() };
            }
        } else {
            return { content: part, key: crypto.randomUUID() };
        }
    });
    return contentParts.map((part: ContentPart) => {
        return part.href ? (
            <a href={part.href} key={part.key}>
                {part.content}
            </a>
        ) : (
            <span key={part.key}>{part.content}</span>
        );
    });
};

const WikiItems: React.FC<AccordianProps> = (props) => {
    const sortedRows: DbWikiRow[] = props.rows.slice().sort((r1: DbWikiRow, r2: DbWikiRow) => {
        return r1.order > r2.order ? 1 : -1;
    });
    return (
        <>
            {sortedRows.map((row: DbWikiRow) => {
                return (
                    <TableSurface key={row.order}>
                        <Accordion elevation={0}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                            >
                                <h2>{row.title}</h2>
                            </AccordionSummary>
                            <AccordionDetails>{convertContentToElements(row.content)}</AccordionDetails>
                        </Accordion>
                    </TableSurface>
                );
            })}
        </>
    );
};

export default WikiItems;
