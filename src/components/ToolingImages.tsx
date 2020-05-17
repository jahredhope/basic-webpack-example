import styled from "@emotion/styled";

import React from "react";

import imgEmotion from "src/tooling-images/emotion-js-icon.png";
import imgLoadableComponents from "src/tooling-images/loadable-components-icon.png";
import imgPuppeteer from "src/tooling-images/puppeteer-icon.png";
import imgTypeScript from "src/tooling-images/typescript-icon.png";
import imgWebpack from "src/tooling-images/webpack-icon.png";

// import theme from "src/tooling-images/src/theme";

const Root = styled("div")`
  display: grid;
  grid-template-columns: repeat(auto-fit, 120px);
  gap: 10px;
  justify-content: flex-start;
  align-items: flex-start;
`;

const ToolingImageWrapper = styled("a")`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 120px;
  width: 120px;
`;

const ToolingImage = styled("img")`
  max-width: 100px;
  max-height: 100px;
  margin: 0 auto;
`;

export default function ToolingImages() {
  return (
    <Root>
      <ToolingImageWrapper>
        <ToolingImage src={imgEmotion} />
      </ToolingImageWrapper>
      <ToolingImageWrapper>
        <ToolingImage src={imgLoadableComponents} />
      </ToolingImageWrapper>
      <ToolingImageWrapper>
        <ToolingImage src={imgPuppeteer} />
      </ToolingImageWrapper>
      <ToolingImageWrapper>
        <ToolingImage src={imgTypeScript} />
      </ToolingImageWrapper>
      <ToolingImageWrapper>
        <ToolingImage src={imgWebpack} />
      </ToolingImageWrapper>
    </Root>
  );
}
