import { Metadata } from "next";
import { ReactElement } from "react";
import InfoPage, { getTopWikiRow } from "@/app/info/InfoPage";
import Title from "@/components/Title/Title";
export const dynamic = "force-dynamic";

const Info = async (): Promise<ReactElement> => {
    const props = await getTopWikiRow();
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
