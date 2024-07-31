import { Metadata } from "next";
import { ReactElement } from "react";
import InfoPage from "@/app/info/InfoPage";
import Title from "@/components/Title/Title";

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
