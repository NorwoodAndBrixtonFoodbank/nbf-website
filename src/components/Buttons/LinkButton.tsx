import React from "react";
import Button from "@mui/material/Button";
import { ButtonWrap, UnstyledLink } from "@/components/Buttons/GeneralButtonParts";

interface Props {
    children?: React.ReactNode;
    link: string;
    disabled?: boolean;
}

const LinkButton: React.FC<Props> = ({ children, link, disabled = false }) => {
    return (
        <ButtonWrap>
            <UnstyledLink href={link}>
                <Button color="primary" variant="contained" disabled={disabled}>
                    {children}
                </Button>
            </UnstyledLink>
        </ButtonWrap>
    );
};

export default LinkButton;
