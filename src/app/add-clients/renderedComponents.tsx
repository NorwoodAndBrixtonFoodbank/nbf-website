import FreeFormTextInput from "@/components/DataInput/FreeFormTextInput";
import React from "react";
import styled from "styled-components";

const Text = styled.p`
    padding-bottom: 1em;
`;

const Subheading = styled.h2`
    padding-bottom: 1em;
`;

const Asterisk = styled.span`
    color: ${(props) => props.theme.errorColor};
    &:before {
        content: "*";
    }
`;

const errorExists = (errorMessage: string): boolean => {
    return errorMessage !== "" && errorMessage !== "N/A";
};

const errorText = (errorMessage: string): string => {
    return errorMessage == "N/A" ? "" : errorMessage;
};

const FullName: React.FC = (errorMessage: string, onChange) => {
    return (
        <>
            <Subheading>
                Client Full Name <Asterisk />
            </Subheading>
            <Text>First and last name</Text>
            <FreeFormTextInput
                error={errorExists(errorMessage)}
                helperText={errorText(errorMessage)}
                label="Name"
                onChange={onChange}
            />
        </>
    );
};
