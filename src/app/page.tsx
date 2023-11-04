import { redirect } from "next/navigation";
import React from "react";

const Home: React.FC<{}> = () => {
    return redirect("/");
};

export default Home;
