import React from "react";
import Icon from "@/components/Icons/Icon";
import { faTruck } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "styled-components";

const DeliveryIcon: React.FC<{}> = () => {
    const theme = useTheme();
    return <Icon icon={faTruck} onHoverText="Delivery" color={theme.foregroundColor} />;
};

export default DeliveryIcon;
