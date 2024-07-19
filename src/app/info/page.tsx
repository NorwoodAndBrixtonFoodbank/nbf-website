import { Metadata } from "next";
import { ReactElement } from "react";
import InfoPage, { getWikiRows } from "@/app/info/InfoPage";
import Title from "@/components/Title/Title";

const Info = async (): Promise<ReactElement> => {
    const props = await getWikiRows();
    return (
        <main>
            <Title>Info Page</Title>
            <InfoPage {...props} />
        </main>
    );
};

export const metadata: Metadata = {
    title: "Info",
};

export default Info;
