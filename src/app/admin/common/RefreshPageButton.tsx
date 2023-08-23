import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons/faArrowsRotate";
import React from "react";

const RefreshPageButton: React.FC<{}> = () => {
    const refreshPage = (): void => {
        window.location.reload();
    };

    return (
        <Button
            variant="outlined"
            startIcon={<FontAwesomeIcon icon={faArrowsRotate} />}
            onClick={refreshPage}
        >
            Refresh Page
        </Button>
    );
};

export default RefreshPageButton;
