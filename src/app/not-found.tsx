import Link from "next/link";
import React from "react";

const NotFound: React.FC<{}> = () => {
    return (
        <>
            <p> No page found. </p>
            <Link href="/clients"> Home </Link>
        </>
    );
};

export default NotFound;
