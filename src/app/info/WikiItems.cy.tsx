import WikiItems, { convertContentToElements } from "@/app/info/WikiItems";
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

    // this variable is necessary for spans containing empty strings as directly inserting "" into the element will be removed by the linter
    const emptyString = "";

    // all keys defined to be 'a' to handle the randomly generated uuid keys assigned to testData when passed into formatContent
    const expectedFormattedContent: React.JSX.Element[][] = [
        [
            <span key="a">{"content1 "}</span>,
            <a href="https://www.google.com/" key="a">
                https://www.google.com/
            </a>,
            <span key="a">{" also "}</span>,
            <a href="https://www.bing.com/" key="a">
                bing
            </a>,
            <span key="a">{emptyString}</span>,
        ],
        [<span key="a">no links</span>],
    ];

    it("embeds links correctly", () => {
        const result = testData.map((row) => {
            return convertContentToElements(row.content).map((htmlObject) => {
                return { ...htmlObject, key: "a" };
            });
        });
        console.log("result", result);
        console.log("expected", expectedFormattedContent);
        expect(result).to.deep.equal(expectedFormattedContent);
    });

    it("all rows render", () => {
        cy.mount(<WikiItems rows={testData} />);
    });
});
