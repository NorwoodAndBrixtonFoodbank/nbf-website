import WikiItem, { formatContent } from "@/app/info/WikiItem";
import { DbWikiRow } from "@/databaseUtils";

describe("<WikiAccordian />", () => {
    const testData: DbWikiRow[] = [
        {
            title: "title1",
            content: "content1 <https://www.google.com/> also [bing](https://www.bing.com/)",
            order: 1,
        },
        {
            title: "title2",
            content: "no links",
            order: 2,
        },
    ];

    const expectedFormattedContent: (string | React.JSX.Element)[] = [
        <span key="a">{"content1 "}</span>,
        <a href="https://www.google.com/" key="a">
            https://www.google.com/
        </a>,
        <span key="a">{" also "}</span>,
        <a href="https://www.bing.com/" key="a">
            bing
        </a>,
        <span key="a"></span>,
    ];

    it("embeds links correctly", () => {
        const result = formatContent(testData[0].content).map((htmlObject) => {
            return { ...htmlObject, key: "a" };
        });
        console.log("result", result);
        console.log("expected", expectedFormattedContent);
        expect(result).to.deep.equal(expectedFormattedContent);
    });

    it("top row renders", () => {
        cy.mount(<WikiItem row={testData[0]} />);
    });
});
