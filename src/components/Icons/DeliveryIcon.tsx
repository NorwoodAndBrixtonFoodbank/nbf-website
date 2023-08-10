import React from "react";
import Icon from "@/components/Icons/Icon";
import { faTruck } from "@fortawesome/free-solid-svg-icons";

interface Props {
    color?: string;
}

const DeliveryIcon: React.FC<Props> = (props) => {
    return <Icon icon={faTruck} onHoverText="Delivery" color={props.color} />;
};

export default DeliveryIcon;
