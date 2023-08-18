import React from "react";
import Button from "@mui/material/Button";
import { usePathname } from "next/navigation";
import { UnstyledLink } from "@/components/Buttons/GeneralButtonParts";

interface Props {
    link: string;
    page: string;
    onClick?: () => void;
}

const NavBarButton: React.FC<Props> = (props) => {
    const pathname = usePathname();
    const active = pathname?.startsWith(props.link) ?? false;
    return (
        <UnstyledLink key={props.page} href={props.link} prefetch={false}>
            <Button color="primary" variant={active ? "contained" : "outlined"}>
                {props.page}
            </Button>
        </UnstyledLink>
    );
};

export default NavBarButton;
