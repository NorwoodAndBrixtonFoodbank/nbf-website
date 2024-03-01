import React from "react";
import Icon from "@/components/Icons/Icon";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

interface props {
    color: string;
}
const InformationIcon: React.FC<props> = (props: props) => {
    return <Icon icon={faCircleInfo} onHoverText="More information" color={props.color} />;
};

export default InformationIcon;
