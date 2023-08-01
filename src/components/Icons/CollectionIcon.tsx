"use client";
import React from "react";
import Icon from "@/components/Icons/Icon";
import { faShoePrints } from "@fortawesome/free-solid-svg-icons";

interface Props {
    collectionPoint: string;
}
const CollectionIcon: React.FC<Props> = (props) => {
    return (
        <Icon
            icon={faShoePrints}
            onHoverText={`Collection at ${props.collectionPoint}`}
            color="black"
        />
    );
};

export default CollectionIcon;
