import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPen } from "@fortawesome/free-solid-svg-icons/faUserPen";
import { faKey } from "@fortawesome/free-solid-svg-icons/faKey";
import React from "react";
import { EditHeader, ManageMode } from "@/app/admin/manageUser/ManageUserModal";
import OptionButtonsDiv from "@/app/admin/common/OptionButtonsDiv";

interface Props {
    setManageMode: (mode: ManageMode) => void;
    onCancel: () => void;
}

const ManageUserOptions: React.FC<Props> = ({ setManageMode, onCancel }) => {
    return (
        <>
            <EditHeader>Options</EditHeader>
            <Button
                variant="outlined"
                startIcon={<FontAwesomeIcon icon={faUserPen} />}
                onClick={() => setManageMode("editDetails")}
            >
                Edit Details
            </Button>
            <br />
            <Button
                variant="outlined"
                startIcon={<FontAwesomeIcon icon={faKey} />}
                onClick={() => setManageMode("resetPassword")}
            >
                Reset Password
            </Button>
            <OptionButtonsDiv>
                <Button color="secondary" onClick={onCancel}>
                    Cancel
                </Button>
            </OptionButtonsDiv>
        </>
    );
};

export default ManageUserOptions;
