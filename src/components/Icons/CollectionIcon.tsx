import React from "react";
import Icon from "@/components/Icons/Icon";
import { faShoePrints } from "@fortawesome/free-solid-svg-icons";

export interface CollectionIconProps {
    color?: string;
    collectionPoint: string | null;
}
const CollectionIcon: React.FC<CollectionIconProps> = ({ collectionPoint, color = "black" }) => {
    return (
        <Icon
            icon={faShoePrints}
            onHoverText={`Collection at ${collectionPoint ?? "-"}`}
            color={color}
        />
    );
};

export default CollectionIcon;
