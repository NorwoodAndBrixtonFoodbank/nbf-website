"use client";

import React from "react";
import { Accordion, Checkbox, AccordionSummary, AccordionDetails } from "@mui/material";
import styled from "styled-components";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import Icon from "@/components/Icons/Icon";

interface FilterAccordionProps {
    toggleableHeaders?: string[];
    shownHeaderKeys: string[];
    setShownHeaderKeys: (headers: string[]) => void;
    headers: [string, string][];
}

const Styling = styled.div`
    flex-grow: 1;
    height: 39px;
    overflow: visible;
    z-index: 2;
    & .MuiPaper-root {
        background-color: ${(props) => props.theme.main.background[1]};
        border: 1px solid ${(props) => props.theme.main.lighterForeground[1]};
        box-shadow: none;
        background-image: none;

        color: ${(props) => props.theme.main.lighterForeground[1]};
        border-radius: 0.5rem;
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
        fill: ${(props) => props.color ?? props.theme.main.foreground[0]};
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

const StyledAccordion = styled(Accordion)`
    & .MuiButtonBase-root {
        min-height: 39px;
    }
    & .MuiAccordionSummary-content {
        > div {
            height: 10px;
        }
    }
    p {
        font-size: 14px;
    }
`;

const FilterAccordion: React.FC<FilterAccordionProps> = ({
    toggleableHeaders,
    shownHeaderKeys,
    setShownHeaderKeys,
    headers,
}) => {
    const getOnChanged = (key: string): ((event: React.ChangeEvent<HTMLInputElement>) => void) => {
        return (event) => {
            if (event.target.checked) {
                setShownHeaderKeys([...shownHeaderKeys, key]);
            } else {
                setShownHeaderKeys(shownHeaderKeys.filter((shownKey) => shownKey !== key));
            }
        };
    };

    return (
        <Styling>
            <StyledAccordion>
                <AccordionSummary>
                    <Row>
                        <p>Select Columns</p>
                        <Spacer />
                        <Icon icon={faChevronDown} />
                    </Row>
                </AccordionSummary>
                <AccordionDetails>
                    {(toggleableHeaders ?? []).map((key) => {
                        const headerKeyAndLabel = headers.find(([headerKey]) => headerKey === key);
                        const headerLabel = headerKeyAndLabel ? headerKeyAndLabel[1] : key;
                        return (
                            <ContainerDiv key={key}>
                                <Checkbox
                                    color="primary"
                                    key={key}
                                    checked={shownHeaderKeys.includes(key)}
                                    onChange={getOnChanged(key)}
                                />
                                <p>{headerLabel}</p>
                            </ContainerDiv>
                        );
                    })}
                </AccordionDetails>
            </StyledAccordion>
        </Styling>
    );
};

export default FilterAccordion;
