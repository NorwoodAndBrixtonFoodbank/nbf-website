import React from "react";
import Menu from "@mui/material/Menu/Menu";
import MenuList from "@mui/material/MenuList/MenuList";
import MenuItem from "@mui/material/MenuItem/MenuItem";

export type ListName = "regular" | "hotel";

interface Props {
    listStateAnchorElement: HTMLElement | null;
    setListStateAnchorElement: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
    currentList: ListName;
    setCurrentList: React.Dispatch<React.SetStateAction<ListName>>;
}

const swapListNameValue = (currentListName: ListName): ListName => {
    return currentListName === "regular" ? "hotel" : "regular";
};

const ListStates: React.FC<Props> = ({
    listStateAnchorElement,
    setListStateAnchorElement,
    currentList,
    setCurrentList,
}) => {
    return (
        <>
            {listStateAnchorElement && (
                <Menu
                    open
                    onClose={() => setListStateAnchorElement(null)}
                    anchorEl={listStateAnchorElement}
                >
                    <MenuList id="listType-menu">
                        <MenuItem
                            key={swapListNameValue(currentList)}
                            onClick={() => {setCurrentList(swapListNameValue(currentList)); setListStateAnchorElement(null)}}
                        >
                            {swapListNameValue(currentList)}
                        </MenuItem>
                    </MenuList>
                </Menu>
            )}
        </>
    );
};

export default ListStates;
