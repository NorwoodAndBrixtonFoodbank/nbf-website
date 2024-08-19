import React from "react";
import Button from "@mui/material/Button";
import { ButtonWrap } from "@/components/Buttons/GeneralButtonParts";

interface Props {
    children: React.ReactNode;
    onClick: () => void;
}

const DeleteButton = React.forwardRef<HTMLButtonElement, Props>(({ children, onClick }, ref) => {
    return (
        <ButtonWrap>
            <Button onClick={onClick} color="error" variant="contained" ref={ref}>
                {children}
            </Button>
        </ButtonWrap>
    );
});

DeleteButton.displayName = "DeleteButton";

export default DeleteButton;
