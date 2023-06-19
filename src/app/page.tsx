import { redirect } from "next/navigation";
import React from "react";

const Home: React.FC<{}> = () => {
    return redirect("/clients");
};

export default Home;
