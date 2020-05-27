import { Page } from "puppeteer";

const timeout = 5000;

const rootUrl = "http://localhost:8080";
const pageA = `${rootUrl}/a`;
const pageB = `${rootUrl}/b`;
const pageC = `${rootUrl}/c`;

describe("Page Load", () => {
  let page: Page;
  beforeAll(async () => {
    page = await (global as any).__BROWSER__.newPage();
  }, timeout);

  describe.each([
    ["Page A", pageA, "/a/"],
    ["Page B", pageB, "/b/"],
    ["Page C", pageC, "/c/"],
  ])(
    "Page: %s",
    (
      expectedPageTitle: string,
      pageUrl: string,
      expectedRenderedPath: string
    ) => {
      beforeAll(async () => {
        await page.goto(pageUrl);
      });

      it("should have rendered with the correct route", async () => {
        const initialRoute = await page.evaluate(
          () => document.getElementById("initialRoute").innerHTML
        );
        expect(initialRoute).toBe(expectedRenderedPath);
      });

      it('should contain the page title"', async () => {
        const text = await page.evaluate(() => document.body.textContent);
        expect(text).toContain(expectedPageTitle);
      });
    }
  );
});

describe("Links", () => {
  it("should be able to navigate to each page", async () => {
    const page: Page = await (global as any).__BROWSER__.newPage();
    await page.goto(pageA);

    await page.click('[data-analytics="header-page-b"]');
    let text = await page.evaluate(() => document.body.textContent);
    expect(text).toContain("Page B");

    await page.click('[data-analytics="header-page-c"]');
    text = await page.evaluate(() => document.body.textContent);
    expect(text).toContain("Page C");

    await page.click('[data-analytics="header-page-a"]');
    text = await page.evaluate(() => document.body.textContent);
    expect(text).toContain("Page A");
  });
});
