import { css } from "@emotion/core";
import styled from "@emotion/styled";
import React from "react";

import theme from "src/theme";

interface IProps {
  to?: string;
  as?: any;
  children?: React.ReactNode;
  heading?: boolean;
  link?: boolean;
  hero?: boolean;
  primary?: boolean;
  secondary?: boolean;
}

const fontSize = ({ heading, hero }: IProps) => {
  if (hero) {
    return css`
      font-size: ${theme.type.size.hero};
    `;
  }
  if (heading) {
    return css`
      font-size: ${theme.type.size.heading};
    `;
  }
  return css`
    font-size: ${theme.type.size.body};
  `;
};
const fontWeight = ({ heading }: IProps) => {
  if (heading) {
    return css`
      font-weight: ${theme.type.weight.heavy};
    `;
  }
  return css`
    font-weight: ${theme.type.weight.light};
  `;
};

const lineHeight = () =>
  css`
    line-height: 24px;
  `;

const color = ({ primary, secondary, link }: IProps) => {
  if (link) {
    return css`
      color: ${theme.colors.line.link};
    `;
  }
  if (primary) {
    return css`
      color: ${theme.colors.line.primary};
    `;
  }
  if (secondary) {
    return css`
      color: ${theme.colors.line.secondary};
    `;
  }
  return css`
    color: ${theme.colors.line.standard};
  `;
};
export default styled("span")`
  margin: 0 0 ${({ heading, hero }) => (heading || hero ? "6px" : "0")};
  display: block;
  text-decoration: none;
  ${color}
  ${fontSize}
  ${fontWeight}
  ${lineHeight}
`;
