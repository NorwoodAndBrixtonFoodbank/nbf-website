import Link from "next/link";
import React from "react";

const NotFound: React.FC<{}> = () => {
    return (
        <>
            <p> Page Not Found </p>
            <Link href="/clients"> Home </Link>
        </>
    );
};

export default NotFound;
