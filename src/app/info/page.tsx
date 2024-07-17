import { Metadata } from "next";
import { ReactElement } from "react";
import { getServerSideProps } from "@/app/info/InfoPage";
import Title from "@/components/Title/Title";
import InfoPage from "@/app/info/InfoPage";

const Info = async (): Promise<ReactElement> => {
    const props = await getServerSideProps()
    return (
        <main>
            <Title>Info Page</Title>
            <InfoPage {...props}/>
        </main>
    );
};

export const metadata: Metadata = {
    title: "Info",
};

export default Info;
