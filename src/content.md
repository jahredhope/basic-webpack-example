# Application breakdown

## Scope

This application is a demo ground for testing web application
behaviours. In order to be a good testing ground it contains example
functionality that needs to be supported. Some behaviours include:
Multiple pages, async loading application, static and server
rendering, and client side JavaScript.

## Structure

This application consists of 3 pages.

Each page has it's own chunks that are only loaded on that page, however all chunks required for that page are loaded immediately.

Pages contain a mix of dynamic content that can be server-side rendered and dynamic content that is only client-side rendered.

The application as much as possible without/before JavaScript has loaded. With the exception of content that is both dynamic and not server-side renderable.

## Features

- Multi page application with [@react/router](https://github.com/reach/router)
- Statically renders multiple routes with [html-render-webpack-plugin](https://github.com/jahredhope/html-render-webpack-plugin)
- Code splitting per route with [loadable-components](https://github.com/smooth-code/loadable-components)
- Dynamic code loading with [loadable-components](https://github.com/smooth-code/loadable-components)
- [Typescript](https://www.typescriptlang.org/docs/handbook/react-&-webpack.html) with [React](https://reactjs.org/)
- CSS in JS with [Emotion JS](https://github.com/emotion-js/emotion)
- Portable bundles with [FAB spec](https://github.com/fab-spec/fab)
- Sharing state with [Unistore](https://github.com/developit/unistore) state management with [React Hooks API](https://github.com/jahredhope/react-unistore)
- Testing in the browser with [Puppeteer](https://github.com/GoogleChrome/puppeteer) and [Jest](https://jestjs.io/)
- Server and Static rendering with production-like dev environments
- Same-domain enabled development
- Loading static content from Markdown (.md) files with [markdown-loader](https://github.com/peerigon/markdown-loader)
