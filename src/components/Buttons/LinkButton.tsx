import React from "react";
import Button from "@mui/material/Button";
import { ButtonWrap, UnstyledLink } from "@/components/Buttons/GeneralButtonParts";

interface Props {
    children: string;
    link: string;
}

const LinkButton: React.FC<Props> = ({ children, link }) => {
    return (
        <ButtonWrap>
            <UnstyledLink href={link} prefetch={false}>
                <Button color="primary" variant="contained">
                    {children}
                </Button>
            </UnstyledLink>
        </ButtonWrap>
    );
};

export default LinkButton;
