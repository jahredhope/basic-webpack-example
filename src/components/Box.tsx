import { HTMLProps } from "react";
import styled from "@emotion/styled";

export type Space =
  | "xsmall"
  | "small"
  | "medium"
  | "large"
  | "xlarge"
  | "xxlarge";

export interface CardProps extends HTMLProps<HTMLElement> {
  ref?: any;
  as?: string;
  padding?: Space;
  paddingX?: Space;
  paddingY?: Space;
  paddingTop?: Space;
  paddingRight?: Space;
  paddingLeft?: Space;
  paddingBottom?: Space;
  margin?: Space;
  marginX?: Space;
  marginY?: Space;
  stack?: Space;
  inline?: Space;
  inset?: boolean;
  color?: "white";
  background?: "card" | "primary" | "secondary" | "brand";
}

export default styled("div")(
  {
    display: "block",
  },
  ({
    padding,
    paddingX,
    paddingY,
    margin,
    marginY,
    marginX,
    paddingTop,
    paddingRight,
    paddingLeft,
    paddingBottom,
  }: CardProps) => {
    const styles = {
      paddingTop: paddingTop || paddingY || padding,
      paddingRight: paddingRight || paddingX || padding,
      paddingLeft: paddingLeft || paddingX || padding,
      paddingBottom: paddingBottom || paddingY || padding,
      marginTop: marginY || margin,
      marginRight: marginX || margin,
      marginLeft: marginX || margin,
      marginBottom: marginY || margin,
    };
    for (const key in styles) {
      styles[key] = styles[key] ? `var(--space-${styles[key]})` : undefined;
    }
    return styles;
  },
  ({ background }: CardProps) =>
    background ? { backgroundColor: `var(--color-${background})` } : null,
  ({ stack }: CardProps) =>
    stack ? { display: "grid", gap: `var(--space-${stack})` } : null,
  ({ inline }: CardProps) =>
    inline
      ? {
          display: "grid",
          gap: `var(--space-${inline})`,
          maxWidth: "100%",
          gridAutoColumns: "minmax(min-content, max-content)",
          gridAutoFlow: "column",
          justifyItems: "flex-start",
          alignItems: "flex-start",
        }
      : null,
  ({ color }: CardProps) => (color ? { color: `var(--color-${color})` } : null),
  ({ inset }: CardProps) =>
    inset
      ? {
          justifySelf: "center",
          width: "100%",
          maxWidth: "calc(100vw - (2 * var(--space-medium)))",
        }
      : null
);
