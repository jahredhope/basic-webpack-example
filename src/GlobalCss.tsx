import React from "react";
import { css, Global } from "@emotion/core";

import theme from "src/theme";

export default function GlobalCss() {
  return (
    <Global
      styles={css`
        :root {
          --color-cream: hsl(190, 8%, 90%);
          --color-brand: ${theme.colors.names.brand};
          --color-brand-light: ${theme.colors.names.brandLight};
          --color-white: hsl(240, 0%, 99%);
          --color-grey-1: hsl(140, 50%, 88%);
          --color-grey-2: hsl(240, 0%, 81%);
          --color-black: hsl(240, 0%, 1%);
          --color-positive: hsl(130, 60%, 30%);
          --color-promote: hsl(280, 50%, 50%);
          --color-promote-light: hsl(280, 80%, 90%);
          --color-standard: hsl(280, 2%, 10%);
          --color-secondary: ${theme.colors.fill.secondary};
          --color-critical: hsl(0, 60%, 45%);
          --color-link: ${theme.colors.line.link};
          --color-card: ${theme.colors.fill.standard};

          --space-xsmall: 4px;
          --space-small: 8px;
          --space-medium: 16px;
          --space-large: 28px;
          --space-xlarge: 48px;
          --space-xxlarge: 96px;

          --content-block-width: 1200px;

          --border-radius: 5px;

          --font-size-small: 14px;
          --font-size-medium: 16px;
          --font-size-large: 20px;
          --font-size-hero: 34px;

          --button-width: 120px;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
            "Segoe UI Symbol";
          padding: 0;
          margin: 0;
          max-width: 100vw;
          background-color: ${theme.colors.fill.standard};
        }
        a,
        a:visited {
          text-decoration: inherit;
        }
        * {
          margin: 0;
          padding: 0;
        }

        li {
          display: inline;
        }

        a:hover,
        a:active {
          color: inherit;
        }
      `}
    />
  );
}
