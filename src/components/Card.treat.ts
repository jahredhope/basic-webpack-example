import theme from "src/theme";
import { style } from "treat";

export const card = style({
  display: "block",
  fontFamily: "Verdana",
  marginBottom: "6px",
  padding: "12px 18px 0px",
});

export const background = {
  primary: style({ backgroundColor: theme.colors.fill.primary }),
  secondary: style({ backgroundColor: theme.colors.fill.secondary }),
  standard: style({ backgroundColor: theme.colors.fill.standard }),
};
