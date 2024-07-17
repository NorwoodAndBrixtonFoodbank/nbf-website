import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DbWikiRow } from "@/databaseUtils";

interface AccordianProps {
    row: DbWikiRow;
}

interface ContentPart {
    content: string;
    href?: string;
    key: string;
}

export const formatContent: (topRowContent: string) => React.JSX.Element[] = (
    topRowContent: string
) => {
    const topRowContentParts = topRowContent.split(/(\[.*\]\(.*\)|<.*>)/);
    const contentParts: ContentPart[] = topRowContentParts.map((part, index) => {
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

const WikiItem: React.FC<AccordianProps> = (props) => {
    const formattedContent = formatContent(props.row.content);
    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
            >
                {props.row.title}
            </AccordionSummary>
            <AccordionDetails>{formattedContent}</AccordionDetails>
        </Accordion>
    );
};

export default WikiItem;
