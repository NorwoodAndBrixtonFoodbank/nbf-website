"use client";

import { Button, Popover } from "@mui/material";
import React, { useState } from "react";
import CheckboxGroupInput from "./CheckboxGroupInput";
import { ArrowDropDown } from "@mui/icons-material";

interface Props {
    labelsAndKeys: [string, string][];
    defaultCheckedKeys?: string[];
    groupLabel?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CheckboxGroupPopup: React.FC<Props> = (props) => {
    const [popoverAnchorElement, setPopoverAnchorElement] = useState<HTMLElement | null>(null);

    return (
        <>
            {popoverAnchorElement && (
                <Popover
                    open
                    onClose={() => setPopoverAnchorElement(null)}
                    anchorEl={popoverAnchorElement}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                >
                    <CheckboxGroupInput
                        labelsAndKeys={props.labelsAndKeys}
                        defaultCheckedKeys={props.defaultCheckedKeys ?? []}
                        onChange={props.onChange}
                    />
                </Popover>
            )}
            <Button
                variant="outlined"
                onClick={(event) => setPopoverAnchorElement(event.currentTarget)}
                disabled={!props.labelsAndKeys.length}
                type="button"
                id="status-button"
                endIcon={<ArrowDropDown />}
            >
                {props.groupLabel}
            </Button>
        </>
    );
};

export default CheckboxGroupPopup;
