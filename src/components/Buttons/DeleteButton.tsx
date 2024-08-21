import React from "react";
import Button from "@mui/material/Button";

interface Props {
    children: React.ReactNode;
    onClick: () => void;
}

const DeleteButton = React.forwardRef<HTMLButtonElement, Props>(({ children, onClick }, ref) => {
    return (
        <Button onClick={onClick} color="error" variant="contained" ref={ref}>
            {children}
        </Button>
    );
});

DeleteButton.displayName = "DeleteButton";

export default DeleteButton;
