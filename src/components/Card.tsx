import { css } from "@emotion/core";
import styled from "@emotion/styled";
import React from "react";

import theme from "src/theme";

interface IProps {
  children?: React.ReactNode;
  primary?: boolean;
  secondary?: boolean;
}

const background = ({ primary, secondary }: IProps) => {
  if (primary) {
    return css`
      background-color: ${theme.colors.fill.primary};
    `;
  }
  if (secondary) {
    return css`
      background-color: ${theme.colors.fill.secondary};
    `;
  }
  return css`
    background-color: ${theme.colors.fill.standard};
  `;
};
export default styled("span")`
  display: block;
  padding: 12px 18px 0px;
  margin-bottom: 6px;
  font-family: Verdana;
  ${background}
`;
