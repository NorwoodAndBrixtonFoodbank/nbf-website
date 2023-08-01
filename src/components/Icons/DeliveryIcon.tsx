import React from "react";
import Icon from "@/components/Icons/Icon";
import { faTruck } from "@fortawesome/free-solid-svg-icons";

const DeliveryIcon: React.FC<{}> = () => {
    return <Icon icon={faTruck} onHoverText="Delivery" color="black" />;
};

export default DeliveryIcon;
