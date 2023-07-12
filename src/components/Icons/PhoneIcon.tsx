import React from "react";
import Icon from "@/components/Icons/Icon";
import { faPhone } from "@fortawesome/free-solid-svg-icons";

const PhoneIcon: React.FC<{}> = () => {
    return <Icon icon={faPhone} onHoverText="Requires follow-up phone call" color="black" />;
};

export default PhoneIcon;
