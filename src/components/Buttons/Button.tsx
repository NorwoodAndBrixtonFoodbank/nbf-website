import Link from "next/link";
import styled from "styled-components";

const Button = styled(Link)`
    background-color: ${(props) => props.theme.secondaryBackgroundColor};
    padding: 10px;
    border-radius: 5px;
    text-decoration: none;
    color: ${(props) => props.theme.secondaryForegroundColor};

    &:hover {
        font-weight: bold;
    }
`;

export default Button;
