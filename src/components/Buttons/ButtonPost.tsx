import React from "react";
import styled from "styled-components";

const Submit = styled.input.attrs({ type: "submit" })`
    background-color: ${(props) => props.theme.fillColor};
    padding: 10px;
    border-radius: 5px;
    text-decoration: none;
    color: ${(props) => props.theme.foregroundColor};
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
