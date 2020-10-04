import { Global, css } from "@emotion/core";
import React from "react";

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

export default function GlobalCss() {
  return (
    <Global
      styles={css`
        :root {
          --color-brand-dark: hsl(195, 62%, 13%);
          --color-brand-mid: hsl(195, 62%, 24%);
          --color-brand: hsl(195, 62%, 34%);
          --color-brand-light: hsl(195, 32%, 70%);
          --color-white: hsl(240, 0%, 99%);
          --color-off-white: hsl(140, 0%, 97%);
          --color-black: hsl(240, 0%, 1%);
          --color-grey-mid: hsl(240, 10%, 42%);
          --color-grey-dark: hsl(240, 0%, 15%);
          --color-standard: hsl(280, 2%, 10%);
          --color-secondary: hsl(215, 0%, 46%);
          --color-link: hsl(222, 84%, 40%);

          --space-xxsmall: 2px;
          --space-xsmall: 4px;
          --space-small: 8px;
          --space-medium: 16px;
          --space-large: 28px;
          --space-xlarge: 48px;
          --space-xxlarge: 96px;

          --content-block-width: 1200px;

          --border-radius: 3px;

          --font-size-base: 16px;

          --font-size-small: 12px;
          --font-size-small: 14px;
          --font-size-medium: 16px;
          --font-size-large: 18px;
          --font-size-xlarge: 22px;
          --font-size-xxlarge: 30px;

          --font-length-large: 45em;

          --color-background: var(--color-off-white);
          --color-background-secondary: var(--color-white);

          --color-text-tone-light: var(--color-white);
          --color-text-tone-link: var(--color-link);
          --color-text-tone-primary: var(--color-black);
          --color-text-tone-brand: var(--color-brand);
          --color-text-tone-secondary: var(--color-secondary);
          --color-text-tone-standard: var(--color-grey-mid);

          @media only screen and (min-width: 650px) {
            --font-size-xlarge: 30px;
            --font-size-xxlarge: 36px;
          }

          --font-weight-medium: 500;
          --font-weight-heavy: 700;

          --button-width: 120px;

          --box-shadow: 0 4px 4px rgba(50, 50, 93, 0.11),
            0 1px 2px rgba(0, 0, 0, 0.08);

          @media (prefers-color-scheme: dark) {
            --color-background: var(--color-brand-dark);
            --color-background-secondary: var(--color-brand-mid);

            --color-text-tone-light: var(--color-black);
            --color-text-tone-link: hsl(203deg 78% 60%);
            --color-text-tone-primary: var(--color-white);
            --color-text-tone-brand: var(--color-brand-light);
            --color-text-tone-secondary: var(--color-white);
            --color-text-tone-standard: var(--color-white);

            --box-shadow: 0 4px 4px rgba(80, 80, 89, 0.21),
              0 1px 2px rgba(255, 255, 255, 0.08);
          }
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
            "Segoe UI Symbol";
          padding: 0;
          margin: 0;
          font-size: var(--font-size-base);
          color: var(--color-text-tone-standard);
          max-width: 100vw;
          overflow-x: hidden;
          background-color: var(--color-background);
          /* border-top: 6px solid var(--color-brand); */
        }
        a,
        a:visited {
          color: inherit;
          text-decoration: inherit;
        }
        html,
        body,
        div,
        span,
        applet,
        object,
        iframe,
        h1,
        h2,
        h3,
        h4,
        h5,
        h6,
        p,
        blockquote,
        pre,
        a,
        abbr,
        acronym,
        address,
        big,
        cite,
        code,
        del,
        dfn,
        em,
        img,
        ins,
        kbd,
        q,
        s,
        samp,
        small,
        strike,
        strong,
        sub,
        sup,
        tt,
        var,
        b,
        u,
        i,
        center,
        dl,
        dt,
        dd,
        ol,
        ul,
        li,
        fieldset,
        form,
        label,
        legend,
        table,
        caption,
        tbody,
        tfoot,
        thead,
        tr,
        th,
        td,
        article,
        aside,
        canvas,
        details,
        embed,
        figure,
        figcaption,
        footer,
        header,
        hgroup,
        menu,
        nav,
        output,
        ruby,
        section,
        summary,
        time,
        mark,
        audio,
        video {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
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
