import React from "react";
import Icon from "@/components/Icons/Icon";
import { faPhone } from "@fortawesome/free-solid-svg-icons";

interface Props {
    color?: string;
}

const PhoneIcon: React.FC<Props> = ({ color = "black" }) => {
    return <Icon icon={faPhone} onHoverText="Requires follow-up phone call" color={color} />;
};

export default PhoneIcon;
