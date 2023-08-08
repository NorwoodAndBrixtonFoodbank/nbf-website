import React from "react";
import Icon from "@/components/Icons/Icon";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "styled-components";

const PhoneIcon: React.FC<{}> = () => {
    const theme = useTheme();

    return (
        <Icon
            icon={faPhone}
            onHoverText="Requires follow-up phone call"
            color={theme.foregroundColor}
        />
    );
};

export default PhoneIcon;
