"use client";

import React, { useEffect, useState } from "react";
import Table, { TableHeaders } from "@/components/Tables/Table";
import styled from "styled-components";
import { Schema } from "@/databaseUtils";
import { Filter, PaginationType } from "@/components/Tables/Filters";
import { buildTextFilter, filterRowByText } from "@/components/Tables/TextFilter";

interface CollectionCentresTableRow {
    acronym: Schema["collection_centres"]["acronym"];
    name: Schema["collection_centres"]["name"];
    primary_key: Schema["collection_centres"]["primary_key"];
}

export const OptionButtonDiv = styled.div`
    display: flex;
    padding-top: 1rem;
    gap: 1rem;
    justify-content: center;
`;

const collectionCentresTableHeaderKeysAndLabels: TableHeaders<Schema["collection_centres"]> = [
    ["primary_key", "Centre ID"],
    ["name", "Name"],
    ["acronym", "Acronym"],
];

const filters: Filter<CollectionCentresTableRow, string>[] = [
    buildTextFilter({
        key: "name",
        label: "Name",
        headers: collectionCentresTableHeaderKeysAndLabels,
        methodConfig: { paginationType: PaginationType.Client, method: filterRowByText },
    }),
    buildTextFilter({
        key: "acronym",
        label: "Acronym",
        headers: collectionCentresTableHeaderKeysAndLabels,
        methodConfig: { paginationType: PaginationType.Client, method: filterRowByText },
    }),
];

interface Props {
    collectionCentreData: CollectionCentresTableRow[];
}

const CollectionCentresTables: React.FC<Props> = (props) => {
    const [collectionCentres, setCollectionCentres] = useState<Schema["collection_centres"][]>(
        props.collectionCentreData
    );
    const [primaryFilters, setPrimaryFilters] =
        useState<Filter<CollectionCentresTableRow, string>[]>(filters);

    useEffect(() => {
        setCollectionCentres(
            props.collectionCentreData.filter((row) => {
                return primaryFilters.every((filter) => {
                    return (
                        filter.methodConfig.paginationType === PaginationType.Client &&
                        filter.methodConfig.method(row, filter.state, filter.key)
                    );
                });
            })
        );
    }, [primaryFilters, props.collectionCentreData]);

    return (
        <Table
            dataPortion={collectionCentres}
            headerKeysAndLabels={collectionCentresTableHeaderKeysAndLabels}
            defaultShownHeaders={["name", "acronym"]}
            toggleableHeaders={["primary_key"]}
            paginationConfig={{ enablePagination: false }}
            checkboxConfig={{ displayed: false }}
            sortConfig={{ sortPossible: false }}
            editableConfig={{
                editable: true,
                setDataPortion: setCollectionCentres,
            }}
            filterConfig={{
                primaryFiltersShown: true,
                primaryFilters: primaryFilters,
                setPrimaryFilters: setPrimaryFilters,
                additionalFiltersShown: false,
            }}
        />
    );
};

export default CollectionCentresTables;
