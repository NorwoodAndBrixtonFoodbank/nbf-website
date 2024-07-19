import React from "react";
import Menu from "@mui/material/Menu/Menu";
import MenuList from "@mui/material/MenuList/MenuList";
import MenuItem from "@mui/material/MenuItem/MenuItem";

import { Database } from "@/databaseTypesFile";

export type ListName = Database["public"]["Enums"]["list_type"];

// export type ListName = "Regular" | "Hotel";

// export enum ListName {
//     Regular = "Regular",
//     Hotel = "Hotel",
// }
interface Props {
    listStateDropDownElement: HTMLElement | null;
    setListStateDropDownElement: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
    currentList: ListName;
    setCurrentList: React.Dispatch<React.SetStateAction<ListName>>;
}

const swapListNameValue = (currentListName: ListName): ListName => {
    return currentListName === "Regular" ? "Hotel" : "Regular";
};

const ListStates: React.FC<Props> = ({
    listStateDropDownElement,
    setListStateDropDownElement,
    currentList,
    setCurrentList,
}) => {
    return (
        <>
            {
                <Menu
                    open
                    onClose={() => setListStateDropDownElement(null)}
                    anchorEl={listStateDropDownElement}
                >
                    <MenuList id="listType-menu">
                        <MenuItem
                            key={swapListNameValue(currentList)}
                            onClick={() => {
                                setCurrentList(swapListNameValue(currentList));
                                setListStateDropDownElement(null);
                            }}
                        >
                            {swapListNameValue(currentList)}
                        </MenuItem>
                    </MenuList>
                </Menu>
            }
        </>
    );
};

export default ListStates;
