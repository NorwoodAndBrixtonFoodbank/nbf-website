import React from "react";
import {
    Styling,
    StyledAccordion,
    Row,
    Spacer,
    FilterContainerDiv,
} from "@/components/FilterAccordionStyling/filterAccordionStyling";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import Icon from "@/components/Icons/Icon";
import { AccordionSummary, AccordionDetails, Checkbox } from "@mui/material";
import styled from "styled-components";

interface CalendarFilterAccordionProps {
    allLocations: string[];
    editLocations: (locations: string[]) => void;
}

const CalendarFilterAccordion: React.FC<CalendarFilterAccordionProps> = ({
    allLocations,
    editLocations,
}) => {
    return <div>allLocations</div>;
};

const styledCalendarFilterAccordion = styled(CalendarFilterAccordion)`
    z-index: 2;
    overflow: visible;
`;

export default styledCalendarFilterAccordion;
