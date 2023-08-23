"use client";

import React from "react";
import { Accordion, Checkbox, AccordionSummary, AccordionDetails } from "@mui/material";
import styled from "styled-components";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import Icon from "@/components/Icons/Icon";
import { TableHeaders } from "@/components/Tables/Table";
import { Filter } from "@/components/Tables/Filters";

interface FilterAccordionProps<Data> {
    toggleableHeaders?: readonly (keyof Data)[];
    shownHeaderKeys: readonly (keyof Data)[];
    setShownHeaderKeys: (headers: (keyof Data)[]) => void;
    headers: TableHeaders<Data>;
    filters: Filter<Data, any>[];
    setFilters: (filters: Filter<Data, any>[]) => void;
}

const Styling = styled.div`
    flex-grow: 1;
    place-self: center;
    z-index: 2;
    margin: 1rem 0;
    height: 3rem;
    overflow: visible;
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

const ColumnSelectRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
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

const SectionLabel = styled.small`
    font-weight: bold;
`;

const FilterAccordion = <Data extends unknown>({
    toggleableHeaders,
    shownHeaderKeys,
    setShownHeaderKeys,
    headers,
    filters,
    setFilters,
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
                        <p>Additional Filters</p>
                        <Spacer />
                        <Icon icon={faChevronDown} />
                    </Row>
                </AccordionSummary>
                <AccordionDetails>
                    {filters.map((filter, index) => {
                        const onFilter = (state: any): void => {
                            const newFilters = [...filters];
                            newFilters[index] = {
                                ...newFilters[index],
                                state,
                            };
                            setFilters(newFilters);
                        };
                        return filter.filterComponent(filter.state, onFilter);
                    })}
                    <ColumnSelectRow>
                        <SectionLabel>Select Columns:</SectionLabel>
                        {(toggleableHeaders ?? []).map((key) => {
                            const headerKeyAndLabel =
                                headers.find(([headerKey]) => headerKey === key) ?? key.toString();
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
                    </ColumnSelectRow>
                </AccordionDetails>
            </StyledAccordion>
        </Styling>
    );
};

export default FilterAccordion;
