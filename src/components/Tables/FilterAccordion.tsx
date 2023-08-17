"use client";

import React from "react";
import { Accordion, Checkbox, AccordionSummary, AccordionDetails } from "@mui/material";
import styled from "styled-components";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import Icon from "@/components/Icons/Icon";
import { TableHeaders } from "./Table";

interface FilterAccordionProps<Data> {
    toggleableHeaders?: (keyof Data)[];
    shownHeaderKeys: (keyof Data)[];
    setShownHeaderKeys: (headers: (keyof Data)[]) => void;
    headers: TableHeaders<Data>;
}

const Styling = styled.div`
    flex-grow: 1;
    overflow: visible;
    z-index: 2;
`;

const ContainerDiv = styled.div`
    display: flex;
    justify-content: start;
    align-items: center;
    text-align: left;

    & svg {
        fill: ${(props) => props.color ?? props.theme.main.lighterForeground[1]};
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
    &.MuiPaper-root {
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
        & .MuiAccordionSummary-content {
            > div {
                height: 10px;
            }
        }
        p {
            font-size: 14px;
        }
    }
`;

const FilterAccordion = <Data extends unknown>({
    toggleableHeaders,
    shownHeaderKeys,
    setShownHeaderKeys,
    headers,
}: FilterAccordionProps<Data>): React.ReactElement => {
    const getOnChanged = (
        key: keyof Data
    ): ((event: React.ChangeEvent<HTMLInputElement>) => void) => {
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
                        const headerKeyAndLabel = headers.find(([headerKey]) => headerKey === key)!;
                        const headerLabel = headerKeyAndLabel[1];
                        return (
                            <ContainerDiv key={headerLabel}>
                                <Checkbox
                                    color="secondary"
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
