import React from "react";
import Button from "@mui/material/Button";
import { ButtonWrap } from "@/components/Buttons/GeneralButtonParts";

interface Props {
    children: React.ReactNode;
    onClick: () => void;
}

const DeleteButton: React.FC<Props> = ({ children, onClick }) => {
    return (
        <ButtonWrap>
            <Button onClick={onClick} color="error" variant="contained">
                {children}
            </Button>
        </ButtonWrap>
    );
};

export default DeleteButton;
