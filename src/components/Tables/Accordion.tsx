import React from "react";
import { Accordion, Checkbox, AccordionSummary, AccordionDetails } from "@mui/material";
import { styled } from "styled-components";

type FilterAccordionProps = {
    toggleableHeaders?: string[];
    shownHeaderKeys: string[];
    setShownHeaderKeys: (headers: string[]) => void;
    headers: [string, string][];
};

const Styling = styled.div`
    flex-grow: 1;
    height: 3rem;
    overflow: visible;
    z-index: 2;
    & .MuiPaper-root {
        background-color: ${(props) => props.theme.surfaceBackgroundColor};
        & .MuiAccordionDetails-root {
            display: flex;
            flex-wrap: wrap;
            flex-basis: auto;
            gap: 1rem;
        }
    }
`;

const ContainerDiv = styled.div`
    display: flex;
    justify-content: start;
    align-items: center;

    & svg {
        fill: ${(props) => props.theme.primaryBackgroundColor};
    }
`;
const FilterAccordion: React.FC<FilterAccordionProps> = ({
    toggleableHeaders,
    shownHeaderKeys,
    setShownHeaderKeys,
    headers,
}) => {
    return (
        <Styling>
            <Accordion>
                <AccordionSummary>
                    <p>Select Columns</p>
                </AccordionSummary>
                <AccordionDetails>
                    {(toggleableHeaders ?? []).map((key) => {
                        return (
                            <ContainerDiv>
                                <Checkbox 
                                    key={key}
                                    checked={shownHeaderKeys.includes(key)}
                                    onChange={(event) => {
                                        if (event.target.checked) {
                                            setShownHeaderKeys([...shownHeaderKeys, key]);
                                        } else {
                                            setShownHeaderKeys(
                                                shownHeaderKeys.filter(
                                                    (shownKey) => shownKey !== key
                                                )
                                            );
                                        }
                                    }}
                                />
                                <p>
                                    {headers.find(
                                        ([headerKey, _value]) => headerKey === key
                                    )?.[1] ?? key}
                                </p>
                            </ContainerDiv>
                        );
                    })}
                </AccordionDetails>
            </Accordion>
        </Styling>
    );
};

export default FilterAccordion;
