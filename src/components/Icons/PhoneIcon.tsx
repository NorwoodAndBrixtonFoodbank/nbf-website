import React from "react";
import Icon from "@/components/Icons/Icon";
import { faPhone } from "@fortawesome/free-solid-svg-icons";

interface Props {
    color?: string;
}

const PhoneIcon: React.FC<Props> = (props) => {
    return <Icon icon={faPhone} onHoverText="Requires follow-up phone call" color={props.color} />;
};

export default PhoneIcon;
