import React from "react";
import { styled } from "styled-components";
import { TableHeaders } from "./Table";

export abstract class Filter<Data> {
    constructor() {}

    abstract shouldFilter(data: Data): boolean;
    abstract filterComponent(onUpdate: () => void): React.ReactElement;
}

export abstract class KeyedFilter<Data, N extends keyof Data> extends Filter<Data> {
    constructor(public key: N) {
        super();
    }

    shouldFilter(data: Data): boolean {
        return this.shouldFilterValue(data[this.key]);
    }

    abstract shouldFilterValue(key: Data[N]): boolean;
}

export const headerLabelFromKey = <Data, N extends keyof Data>(
    headers: TableHeaders<Data>,
    key: N
): string => {
    return headers.find(([headerKey]) => headerKey === key)![1];
};

const StyledFilterBar = styled.input`
    font-size: 14px;
    width: 15rem;
    overflow: visible;
    box-shadow: none;
    padding: 4px 12px 4px 12px;

    &:focus {
        outline: none;
    }
`;

export class TextFilter<Data, N extends keyof Data> extends KeyedFilter<Data, N> {
    constructor(key: N, public label: string, initialValue?: string) {
        super(key);
        this.state = initialValue ?? "";
    }

    state: string;

    shouldFilterValue(key: Data[N]): boolean {
        return this.toString(key).includes(this.state);
    }

    toString(value: Data[N]): string {
        if (typeof value === "string") {
            return value;
        }

        return JSON.stringify(value);
    }

    filterComponent(onUpdate: () => void): React.ReactElement {
        return (
            <StyledFilterBar
                key={this.label}
                type="text"
                value={this.state}
                placeholder={`Filter by ${this.label}`}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    this.state = event.target.value;
                    onUpdate();
                }}
            />
        );
    }
}
