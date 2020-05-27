import React from "react";
import styled from "@emotion/styled";

import Text from "src/components/Text";
import Link from "src/components/Link";
import { usePageName } from "./usePageName";

import githubLogo from "src/tooling-images/GitHub-Mark-64px.png";
import TextLink from "src/components/TextLink";

import { PageA, PageB, PageC } from "../App";
import { useKeyboardNavigation } from "./useKeyboardNavigation";

const Banner = styled("div")`
  display: grid;
  grid-area: header;
  gap: 15px;
  grid-auto-columns: minmax(min-content, max-content);
  grid-auto-flow: column;
  justify-content: space-between;
  width: 100vw;
  box-sizing: border-box;
  background-color: var(--color-white);
  box-shadow: var(--box-shadow);
  padding: 12px 18px;
  align-items: center;
  // background-color: var(--color-brand);
  // background-image: linear-gradient(
  //   to bottom right,
  //   var(--color-brand),
  //   var(--color-brand-light)
  // );

  grid-template-columns: max-content 1fr;
  grid-template-areas:
    "logo social"
    "menu menu";
  @media only screen and (min-width: 650px) {
    grid-template-columns: 1fr max-content 1fr;
    grid-template-areas: "logo menu social";
  }
`;

const SocialLinks = styled("div")({
  gridArea: "social",
});

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
  margin-bottom: calc(-1 * var(--space-small)) 0;
  padding: var(--space-small) var(--space-small) var(--space-xsmall);
`;

const Tabs = styled("div")`
  grid-area: menu;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  @media only screen and (min-width: 650px) {
    justify-content: center;
  }
`;

const Logo = styled(Text)({
  gridArea: "logo",
});

export default function Header() {
  const pageName = usePageName();
  useKeyboardNavigation();

  return (
    <>
      <Banner>
        <Logo size="heading" weight="heavy">
          Basic Webpack Example
        </Logo>
        <Tabs>
          <TabItem
            tone={pageName === "Page A" ? "brand" : "standard"}
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
            tone={pageName === "Page B" ? "brand" : "standard"}
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
            tone={pageName === "Page C" ? "brand" : "standard"}
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
        <SocialLinks>
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
        </SocialLinks>
      </Banner>
    </>
  );
}
