import { Checkbox } from "@mui/material";
import React from "react";
import styled from "styled-components";

interface CalendarFilterAccordionProps {
    allLocations: string[];
    editLocations: (locations: string[]) => void;
    currentLocations: string[];
}

const ContainerDiv = styled.div`
    display: grid;
    // split rows into 4 columns
    grid-template-columns: repeat(3, 1fr);
    margin-bottom: 1rem;
    justify-content: center;
    background-color: ${(props) => props.theme.main.background[2]};
    padding: 1rem;
    border-radius: 1rem;
    border: 1px solid ${(props) => props.theme.main.border};
`;

const CheckboxAndTitleDiv = styled.div`
    display: flex;
    gap: 0.5rem;
    align-items: center;
`;

const CalendarFilters: React.FC<CalendarFilterAccordionProps> = ({
    allLocations,
    currentLocations,
    editLocations,
}) => {
    return (
        <ContainerDiv>
            <h2>Shown Locations:</h2>
            {allLocations.map((location) => {
                return (
                    <CheckboxAndTitleDiv key={location}>
                        {location}
                        <Checkbox
                            checked={currentLocations.includes(location)}
                            onChange={(event) => {
                                if (event.target.checked) {
                                    editLocations([...currentLocations, location]);
                                    return;
                                }
                                editLocations(
                                    currentLocations.filter(
                                        (testLocation) => testLocation !== location
                                    )
                                );
                            }}
                        />
                    </CheckboxAndTitleDiv>
                );
            })}
        </ContainerDiv>
    );
};

export default CalendarFilters;
