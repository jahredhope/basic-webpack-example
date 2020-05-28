import styled from "@emotion/styled";

import React from "react";

export type FontWeight = "medium" | "heavy";
export type FontSize = "small" | "medium" | "large" | "xlarge";

const tones = {
  light: "var(--color-white)",
  link: "var(--color-link)",
  primary: "var(--color-black)",
  brand: "var(--color-brand)",
  secondary: "var(--color-grey-1)",
  standard: "var(--color-grey-dark)",
};

interface IProps {
  size?: FontSize;
  weight?: FontWeight;
  tone?: keyof typeof tones;
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
  ({ tone }: IProps) => (tone ? { color: tones[tone || "standard"] } : null),
  ({ weight }: IProps) => ({
    fontWeight: `var(--font-weight-${weight})` as any,
  }),
  ({ size }: IProps) => ({ fontSize: `var(--font-size-${size})` }),
  ({ center }: IProps) => (center ? { textAlign: "center" } : null),
  ({ inline }: IProps) => ({ display: inline ? "inline" : "block" }),
  ({ emphasis }: IProps) => (emphasis ? { fontStyle: "italic" } : null)
);
