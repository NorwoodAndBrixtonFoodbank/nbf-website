import { Metadata } from "next";
import { ReactElement } from "react";
import Title from "@/components/Title/Title";
import InfoPage from "./InfoPage";

const Info = async (): Promise<ReactElement> => {
    return (
        <main>
            <Title>Info Page</Title>
            <InfoPage />
        </main>
    );
};

export const metadata: Metadata = {
    title: "Info",
};

export default Info;
