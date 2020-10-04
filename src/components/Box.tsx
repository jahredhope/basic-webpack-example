import styled from "@emotion/styled";
import { HTMLProps } from "react";

/**
 *A valid color to be used for CSS color attribute
 */
export type Color =
  | "brand"
  | "brand-light"
  | "white"
  | "off-white"
  | "black"
  | "grey-dark"
  | "standard"
  | "secondary"
  | "link";

export type Space =
  | "xxsmall"
  | "xsmall"
  | "small"
  | "medium"
  | "large"
  | "xlarge"
  | "xxlarge";

export interface BoxProps extends HTMLProps<HTMLElement> {
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
  color?: Color;
  background?: Color;
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
  }: BoxProps) => {
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
      // @ts-expect-error TODO: Fix this hack
      styles[key] = styles[key] ? `var(--space-${styles[key]})` : undefined;
    }
    return styles;
  },
  ({ background }: BoxProps) =>
    background ? { backgroundColor: `var(--color-${background})` } : null,
  ({ stack }: BoxProps) =>
    stack ? { display: "grid", gap: `var(--space-${stack})` } : null,
  ({ inline }: BoxProps) =>
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
  ({ color }: BoxProps) => (color ? { color: `var(--color-${color})` } : null),
  ({ inset }: BoxProps) =>
    inset
      ? {
          justifySelf: "center",
          width: "100%",
          maxWidth: "calc(100vw - (2 * var(--space-medium)))",
        }
      : null
);
