import styled from "@emotion/styled";
import React, { useEffect } from "react";
import { useNetwork } from "react-use";
import { PageA, PageB, PageC } from "../App";
import Box from "./Box";
import { useKeyboardNavigation } from "./useKeyboardNavigation";
import { usePageName } from "./usePageName";
import Link from "src/components/Link";
import Text from "src/components/Text";
import TextLink from "src/components/TextLink";
import githubLogo from "src/tooling-images/GitHub-Mark-64px.png";

const Banner = styled("div")`
  display: grid;
  grid-area: header;
  gap: 15px;
  grid-auto-columns: minmax(min-content, max-content);
  grid-auto-flow: column;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
  background-color: var(--color-background);
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

  @media (prefers-color-scheme: dark) {
    border-bottom: solid 1px var(--color-white);
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
  height: 34px;
  width: 34px;
`;

const StyledTabItem = styled(TextLink)`
  margin-bottom: calc(-1 * var(--space-small)) 0;
  padding: var(--space-small) var(--space-small) var(--space-xsmall);
`;

const TabItem = (props: any) => (
  <StyledTabItem {...props} tone={props.active ? "brand" : "standard"} />
);

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
  const network = useNetwork();
  useEffect(() => {
    setTimeout(() => {
      PageA.preload();
      PageB.preload();
      PageC.preload();
    }, 1000);
  }, []);
  useKeyboardNavigation();

  return (
    <>
      <Banner>
        <Logo size="medium" weight="heavy">
          Basic Webpack Example
        </Logo>
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
        <SocialLinks>
          <RightAligned>
            <Box inline="medium">
              {network.online === false && <Text>Offline</Text>}
              <Link
                name="toGithubRepository"
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/jahredhope/basic-webpack-example"
              >
                <GithubLogo src={githubLogo} alt="GitHub" />
              </Link>
            </Box>
          </RightAligned>
        </SocialLinks>
      </Banner>
    </>
  );
}
