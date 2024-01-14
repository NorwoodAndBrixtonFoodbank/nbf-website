"use client";

import React from "react";
import styled from "styled-components";
import { Accordion, Checkbox, AccordionDetails } from "@mui/material";
import { TableHeaders } from "@/components/Tables/Table";

interface FilterAccordionProps<Data> {
    toggleableHeaders?: readonly (keyof Data)[];
    shownHeaderKeys: readonly (keyof Data)[];
    setShownHeaderKeys: (headers: (keyof Data)[]) => void;
    headers: TableHeaders<Data>;
}

const ContainerDiv = styled.div`
    display: flex;
    justify-content: start;
    align-items: center;
    text-align: left;

    & svg {
        fill: ${(props) => props.color ?? props.theme.main.lighterForeground[1]};
    }
`;

const ColumnSelectRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
`;

const StyledAccordion = styled(Accordion)`
    &.MuiPaper-root {
        background-color: ${(props) => props.theme.main.background[1]};
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

const SectionLabel = styled.small`
    font-weight: bold;
`;

const FilterAccordion = <Data,>({
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
        <div>
            <StyledAccordion>
                <AccordionDetails>
                    <ColumnSelectRow>
                        <SectionLabel>Select Columns:</SectionLabel>
                        {(toggleableHeaders ?? []).map((key) => {
                            const headerKeyAndLabel =
                                headers.find(([headerKey]) => headerKey === key) ?? key.toString();
                            const headerLabel = headerKeyAndLabel[1];
                            return (
                                <ContainerDiv key={headerLabel}>
                                    <label
                                        htmlFor={`${headerLabel}-checkbox`}
                                        aria-label={`Toggle ${headerLabel} column`}
                                    >
                                        <Checkbox
                                            color="secondary"
                                            checked={shownHeaderKeys.includes(key)}
                                            onChange={getOnChanged(key)}
                                            id={`${headerLabel}-checkbox`}
                                        />
                                    </label>
                                    <p>{headerLabel}</p>
                                </ContainerDiv>
                            );
                        })}
                    </ColumnSelectRow>
                </AccordionDetails>
            </StyledAccordion>
        </div>
    );
};

export default FilterAccordion;
