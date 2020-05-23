import styled from "@emotion/styled";

import React from "react";

import theme from "src/theme";

interface IProps {
  to?: string;
  size?: keyof typeof theme.type.size;
  weight?: keyof typeof theme.type.weight;
  tone?: keyof typeof theme.colors.line;
  as?: any;
  children?: React.ReactNode;
  center?: boolean;
  inline?: boolean;
  emphasis?: boolean;
}

export default styled("span")(
  {
    display: "block",
    lineHeight: "1.4em",
  },
  ({ tone }: IProps) =>
    tone ? { color: theme.colors.line[tone || "standard"] } : null,
  ({ weight }: IProps) => ({
    fontWeight: theme.type.weight[weight || "light"],
  }),
  ({ size }: IProps) => ({ fontSize: theme.type.size[size || "body"] }),
  ({ center }: IProps) => (center ? { textAlign: "center" } : null),
  ({ inline }: IProps) => ({ display: inline ? "inline" : "block" }),
  ({ emphasis }: IProps) => (emphasis ? { fontStyle: "italic" } : null)
);
