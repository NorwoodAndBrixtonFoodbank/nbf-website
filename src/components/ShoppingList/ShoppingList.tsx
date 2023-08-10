"use client";

import React from "react";
import styled from "styled-components";
import {
    ClientSummary,
    HouseholdSummary,
    Item,
    ParcelInfo,
    RequirementSummary,
    ShoppingListProps,
} from "@/components/ShoppingList/dataPreparation";
import { CenterComponent } from "@/components/Form/formStyling";

const Paper = styled.div`
    width: min(80%, 1000px);
    max-height: max-content;
    background-color: ${(props) => props.theme.main.background[0]};
    color: ${(props) => props.theme.main.foreground[0]};
    outline: 1px solid ${(props) => props.theme.main.foreground[0]};
`;

const Cell = styled.div`
    display: grid;
    outline: 1px solid ${(props) => props.theme.main.foreground[0]};
`;

const InfoBlock = styled(Cell)`
    grid-template-columns: 1fr 1fr;
`;

const Table = styled(Cell)`
    grid-template-columns: 4fr 2fr 5fr 1fr;
`;

const Title = styled.h1`
    padding: 1rem;
`;

const Subtitle = styled.h2`
    padding: 1rem;
`;

const KeyText = styled.p`
    font-weight: bold;
    padding: 0.5rem;
`;

const NormalText = styled.span`
    font-weight: normal;
    padding: 0.5rem;
`;

const LineBreak = styled.pre`
    font-family: inherit;
`;

const OneLine: React.FC<{ header: string; value: string }> = ({ header, value }) => {
    return (
        <KeyText>
            {header.toUpperCase()}:<NormalText>{value}</NormalText>
        </KeyText>
    );
};

const TableHeadings: React.FC<{}> = () => {
    return (
        <>
            <Cell>
                <KeyText>Item Description</KeyText>
            </Cell>
            <Cell>
                <KeyText>Quantity</KeyText>
            </Cell>
            <Cell>
                <KeyText>Notes</KeyText>
            </Cell>
            <Cell>
                <KeyText>Done</KeyText>
            </Cell>
        </>
    );
};

const DisplayItemsList: React.FC<{ itemsList: Item[] }> = ({ itemsList }) => {
    const ItemToRow: React.FC<Item> = (item) => {
        return (
            <>
                <Cell>
                    <NormalText>{item.description}</NormalText>
                </Cell>
                <Cell>
                    <NormalText>{item.quantity}</NormalText>
                </Cell>
                <Cell>
                    <NormalText>{item.notes}</NormalText>
                </Cell>
                <Cell></Cell>
            </>
        );
    };

    return (
        <>
            {itemsList.map((item, index) => (
                <ItemToRow {...item} key={index} />
            ))}
        </>
    );
};

const formatKey = (objectKey: string): string => {
    return objectKey.replace("_", " ");
};

const DisplayAsBlock: React.FC<ParcelInfo | HouseholdSummary | RequirementSummary> = (data) => {
    return (
        <Cell>
            {Object.keys(data).map((propKey, index) => (
                <OneLine
                    key={index}
                    header={formatKey(propKey)}
                    value={data[propKey as keyof typeof data]}
                />
            ))}
        </Cell>
    );
};

const DisplayClientSummary: React.FC<ClientSummary> = (clientSummary) => {
    return (
        <>
            {Object.keys(clientSummary).map((propKey, index) => (
                <Cell key={index}>
                    <LineBreak>
                        <OneLine
                            header={formatKey(propKey)}
                            value={clientSummary[propKey as keyof ClientSummary]}
                        />
                    </LineBreak>
                </Cell>
            ))}
        </>
    );
};

const ShoppingList: React.FC<ShoppingListProps> = ({
    postcode,
    parcelInfo,
    clientSummary,
    householdSummary,
    requirementSummary,
    itemsList,
    endNotes,
}) => {
    return (
        <>
            <CenterComponent>
                <Paper>
                    <Cell>
                        <Title>Shopping List</Title>
                        <Subtitle>POSTCODE: {postcode}</Subtitle>
                    </Cell>
                    <DisplayAsBlock {...parcelInfo} />
                    <InfoBlock>
                        <DisplayClientSummary {...clientSummary} />
                        <DisplayAsBlock {...householdSummary} />
                        <DisplayAsBlock {...requirementSummary} />
                    </InfoBlock>
                    <Table>
                        <TableHeadings />
                        <DisplayItemsList itemsList={itemsList} />
                    </Table>
                    <Cell>
                        <KeyText>Warehouse Manager Notes</KeyText>
                        <NormalText>{endNotes}</NormalText>
                        <OneLine header="Date Packed" value="" />
                        <OneLine header="Packer Name" value="" />
                        <OneLine header="Packer Signature" value="" />
                    </Cell>
                </Paper>
            </CenterComponent>
        </>
    );
};

export default ShoppingList;
