import React from "react";
import Button from "@mui/material/Button";
import { UnstyledLink } from "@/components/Buttons/GeneralButtonParts";

interface Props {
    children?: React.ReactNode;
    link: string;
    disabled?: boolean;
}

const LinkButton: React.FC<Props> = ({ children, link, disabled = false }) => {
    return (
        <UnstyledLink href={link}>
            <Button color="primary" variant="contained" disabled={disabled}>
                {children}
            </Button>
        </UnstyledLink>
    );
};

export default LinkButton;
