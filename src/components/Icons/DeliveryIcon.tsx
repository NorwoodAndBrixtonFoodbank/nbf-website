import React from "react";
import Icon from "@/components/Icons/Icon";
import { faTruck } from "@fortawesome/free-solid-svg-icons";

interface Props {
    color?: string;
}

const DeliveryIcon: React.FC<Props> = ({ color = "black" }) => {
    return <Icon icon={faTruck} onHoverText="Delivery" color={color} />;
};

export default DeliveryIcon;
