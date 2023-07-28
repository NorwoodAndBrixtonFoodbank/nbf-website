import React from "react";
import styled from "styled-components";

const Submit = styled.input.attrs({ type: "submit" })`
    background-color: ${(props) => props.theme.primary.background[2]};
    padding: 10px;
    border-radius: 5px;
    text-decoration: none;
    color: ${(props) => props.theme.primary.foreground[2]};
    border: 0 solid black;

    &:hover {
        font-weight: bold;
    }
`;

interface Props {
    text?: string;
    url: string;
}

const ButtonPost: React.FC<Props> = (props) => {
    return (
        <form action={props.url} method="post">
            <Submit value={props.text ?? "Submit"} />
        </form>
    );
};

export default ButtonPost;
