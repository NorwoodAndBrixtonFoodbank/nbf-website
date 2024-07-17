import { formatContent } from "@/app/info/WikiItem";
import WikiItems from "@/app/info/WikiItem";
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
        "content1 ",
        <a href="https://www.google.com/" key={0}>
            https://www.google.com/
        </a>,
        " also ",
        <a href="https://www.bing.com/" key={1}>
            bing
        </a>,
        "",
    ];

    it("embeds links correctly", () => {
        const result = formatContent(testData[0].content);
        expect(result).to.deep.equal(expectedFormattedContent);
    });

    it("top row renders", () => {
        cy.mount(
            <WikiItems
                row={testData[0]}
            />
        );
    });
});
