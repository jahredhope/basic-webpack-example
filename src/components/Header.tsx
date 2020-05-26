import React from "react";
import styled from "@emotion/styled";

import Text from "src/components/Text";
import Link from "src/components/Link";
import { usePageName } from "./usePageName";

import githubLogo from "src/tooling-images/GitHub-Mark-64px.png";
import TextLink from "src/components/TextLink";

import { PageA, PageB, PageC } from "../App";

const Banner = styled("div")`
  display: grid;
  grid-area: header;
  gap: 15px;
  grid-template-columns: 1fr max-content 1fr;
  grid-auto-columns: minmax(min-content, max-content);
  grid-auto-flow: column;
  justify-content: space-between;
  width: 100vw;
  box-sizing: border-box;
  padding: 12px 18px;
  align-items: flex-end;
  background-color: var(--color-brand);
  // background-image: linear-gradient(
  //   to bottom right,
  //   var(--color-brand),
  //   var(--color-brand-light)
  // );
`;

const RightAligned = styled("div")`
  display: flex;
  justify-content: flex-end;
`;

const GithubLogo = styled("img")`
  margin: -5px;
  padding: 5px 5px;
  height: 24px;
  width: 24px;
`;

const TabItem = styled(TextLink)`
  padding: var(--space-small) var(--space-small) var(--space-xsmall);
  ${({ active }) =>
    active ? `border-bottom: 2px solid var(--color-link);` : ""}
`;

const Tabs = styled("div")`
  grid-area: links;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

export default function Header() {
  const pageName = usePageName();

  return (
    <>
      <Banner>
        <div />
        <Text size="heading" tone="light">
          Basic Webpack Example - {pageName}
        </Text>
        <div>
          <RightAligned>
            <Link
              name="toGithubRepository"
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/jahredhope/basic-webpack-example"
            >
              <GithubLogo src={githubLogo} alt="GitHub" />
            </Link>
          </RightAligned>
        </div>
      </Banner>

      <Tabs>
        <TabItem
          href="/"
          active={pageName === "Page A"}
          data-analytics="header-page-a"
          name="header-page-a"
          onMouseOver={() => {
            PageA.preload();
          }}
        >
          Page A
        </TabItem>
        <TabItem
          href="/b/"
          active={pageName === "Page B"}
          data-analytics="header-page-b"
          name="header-page-b"
          onMouseOver={() => {
            PageB.preload();
          }}
        >
          Page B
        </TabItem>
        <TabItem
          href="/c/"
          active={pageName === "Page C"}
          data-analytics="header-page-c"
          name="header-page-c"
          onMouseOver={() => {
            PageC.preload();
          }}
        >
          Page C
        </TabItem>
      </Tabs>
    </>
  );
}
