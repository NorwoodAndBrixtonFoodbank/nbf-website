import React from "react";
import Icon from "@/components/Icons/Icon";
import { faShoePrints } from "@fortawesome/free-solid-svg-icons";

interface CollectionIconProps {
    collectionPoint: string;
}
const CollectionIcon: React.FC<CollectionIconProps> = (props) => {
    return (
        <Icon
            icon={faShoePrints}
            onHoverText={`Collection at ${props.collectionPoint}`}
            color="black"
        />
    );
};

export default CollectionIcon;
