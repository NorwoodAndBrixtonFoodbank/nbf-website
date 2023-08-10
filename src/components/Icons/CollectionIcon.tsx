import React from "react";
import Icon from "@/components/Icons/Icon";
import { faShoePrints } from "@fortawesome/free-solid-svg-icons";

export interface CollectionIconProps {
    color?: string;
    collectionPoint: string | null;
}
const CollectionIcon: React.FC<CollectionIconProps> = (props) => {
    return (
        <Icon
            icon={faShoePrints}
            onHoverText={`Collection at ${props.collectionPoint ?? "-"}`}
            color={props.color}
        />
    );
};

export default CollectionIcon;
