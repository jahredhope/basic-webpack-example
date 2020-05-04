import { css } from "@emotion/core";
import styled from "@emotion/styled";
import React from "react";

import theme from "src/theme";

interface IProps {
  children?: React.ReactNode;
  primary?: boolean;
  secondary?: boolean;
}

const background = ({}: IProps) => {
  return css`
    color: ${theme.colors.line.light};
    background-color: ${theme.colors.button.standard};
  `;
};
export default styled("button")`
  cursor: pointer;
  border: none;
  padding: ${theme.grid.height.medium} ${theme.grid.width.medium};
  margin: ${theme.grid.height.small} ${theme.grid.width.small};
  line-height: 1.1rem;
  font-size: ${theme.type.size.body};
  ${background}
`;
