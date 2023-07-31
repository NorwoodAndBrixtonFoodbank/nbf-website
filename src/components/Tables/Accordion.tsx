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
    margin-bottom: 0.5rem;
    margin-top: 0.5rem;
    & .MuiPaper-root {
        background-color: ${(props) => props.theme.surfaceBackgroundColor};
        border: 1px solid ${(props) => props.theme.secondaryBackgroundColor};
        box-shadow: 0 0 1px ${(props) => props.theme.secondaryBackgroundColor};
        // TODO: VFB16 change to a theme specific grey
        color: ${(props) => props.theme.surfaceForegroundColor};
        border-radius: 0.5rem !important;
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

const Row = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
`;

const Spacer = styled.div`
    flex-grow: 1;
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
                    <Row>
                        <p>Select Columns</p>
                        <Spacer />
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M7.41 8.58997L12 13.17L16.59 8.58997L18 9.99997L12 15L6 9.99997L7.41 8.58997Z"
                                fill="black"
                            />
                        </svg>
                    </Row>
                </AccordionSummary>
                <AccordionDetails>
                    {(toggleableHeaders ?? []).map((key) => {
                        return (
                            <ContainerDiv key={key}>
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
                                    {headers.find(([headerKey]) => headerKey === key)?.[1] ?? key}
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
