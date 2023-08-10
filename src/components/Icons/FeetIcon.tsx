import React from "react";
import Icon from "@/components/Icons/Icon";
import { faShoePrints } from "@fortawesome/free-solid-svg-icons";

export interface FeetIconProps {
    collectionPoint: string;
}
const FeetIcon: React.FC<FeetIconProps> = (props) => {
    return (
        <Icon
            icon={faShoePrints}
            onHoverText={`Collection at ${props.collectionPoint}`}
            color="black"
        />
    );
};

export default FeetIcon;
