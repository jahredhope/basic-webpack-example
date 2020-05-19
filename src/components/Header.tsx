import React from "react";
import styled from "@emotion/styled";

import Text from "src/components/Text";
import Link from "src/components/Link";
import theme from "src/theme";
import { usePageName } from "./usePageName";

import githubLogo from "src/tooling-images/GitHub-Mark-64px.png";

const BannerHeading = styled(Text)`
  align-self: flex-end;
`;

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
  background-color: ${theme.colors.fill.secondary};
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

export default function Header() {
  const pageName = usePageName();

  return (
    <Banner>
      <div />
      <BannerHeading heading>Basic Webpack Example - {pageName}</BannerHeading>
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
  );
}
