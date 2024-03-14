"use client";

import { Checkbox, FormControlLabel } from "@mui/material";
import styled from "styled-components";

interface CalendarFilterAccordionProps {
    allLocations: string[];
    editLocations: (locations: string[]) => void;
    currentLocations: string[];
}

const ContainerDiv = styled.div`
    display: grid;
    margin-bottom: 1rem;
    justify-content: center;
    background-color: ${(props) => props.theme.main.background[2]};
    color: ${(props) => props.theme.main.foreground[2]};
    padding: 1rem;
    border-radius: 1rem;
    border: 1px solid ${(props) => props.theme.main.border};
    grid-template-columns: 1fr;
    @media (min-width: 700px) {
        grid-template-columns: repeat(2, 1fr);
    }
    @media (min-width: 1100px) {
        grid-template-columns: repeat(3, 1fr);
    }
`;

const CheckboxAndTitleDiv = styled.div`
    display: flex;
    gap: 0.5rem;
    align-items: center;
    min-width: 300px;
`;

const CalendarFilters: React.FC<CalendarFilterAccordionProps> = ({
    allLocations,
    currentLocations,
    editLocations,
}) => {
    const onChange = (event: React.ChangeEvent<HTMLInputElement>, location: string): void => {
        if (event.target.checked) {
            editLocations([...currentLocations, location]);
            } else {
                editLocations(currentLocations.filter((testLocation) => testLocation !== location));            }
        }
    
    const handleSelectAllChange = () => {
        if (allLocations.length === currentLocations.length) {
            editLocations([]);
        } else {
            editLocations([...allLocations]);
        }
    };
    
    return (
        <ContainerDiv>
            <h2>Shown Locations:</h2>
                    <CheckboxAndTitleDiv>
                        <FormControlLabel
                            label={"Select All"}
                            control={<Checkbox
                                checked={allLocations.length === currentLocations.length}
                                onChange={handleSelectAllChange}
                            />
                            }/>
                    </CheckboxAndTitleDiv>
                    {allLocations.map((location) => {
                        return (
                            <CheckboxAndTitleDiv key={location}>
                                <FormControlLabel
                                label={`${location}`}
                                control={<Checkbox
                                    checked={currentLocations.includes(location)}
                                    onChange={(event) => {
                                        if (currentLocations.includes(location)) {
                                            onChange(event, location)}
                                            else {
                                                const oldSelectedLocations =[...currentLocations];
                                                oldSelectedLocations.push(location);
                                                editLocations(oldSelectedLocations);
                                            }
                                        }}
                                    />}
                                />
                            </CheckboxAndTitleDiv>
                        );
                    })}
                </ContainerDiv>
            );
        };

export default CalendarFilters;
