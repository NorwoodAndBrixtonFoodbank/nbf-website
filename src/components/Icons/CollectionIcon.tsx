import React from "react";
import Icon from "@/components/Icons/Icon";
import { faShoePrints } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "styled-components";

export interface CollectionIconProps {
    collectionPoint: string | null;
}

const CollectionIcon: React.FC<CollectionIconProps> = (props) => {
    const theme = useTheme();

    return (
        <Icon
            icon={faShoePrints}
            onHoverText={`Collection at ${props.collectionPoint ?? "-"}`}
            // TODO CHange to new theming
            color={theme.foregroundColor}
        />
    );
};

export default CollectionIcon;
