# mysterium-vpn-desktop

[![Github All Releases](https://img.shields.io/github/downloads/mysteriumnetwork/mysterium-vpn-desktop/total.svg)](https://github.com/mysteriumnetwork/mysterium-vpn-desktop/releases)
![Lint](https://github.com/mysteriumnetwork/mysterium-vpn-desktop/workflows/Lint/badge.svg?event=push)

**Work in progress: use with care**

This is a rewrite of [Mysterium VPN desktop](https://github.com/mysteriumnetwork/mysterium-vpn) with the following goals:
- Improved performance
- Improved UX
- Simplified codebase
- Integrated payments

## Getting started (development)

1. Install and build the project
    ```
    yarn && yarn build
    ```
2. Start (webpack dev server with hot reload):

    ```
    yarn dev
    ```

## Using a custom Mysterium Node version

Instead of using prebuilt Node binary (located in `static/`), you may build [Node](https://github.com/mysteriumnetwork/node) from sources and start it in daemon mode with required permissions, e.g.:

```
git clone https://github.com/mysteriumnetwork/node
cd node
bin/build
mage daemon
```

App will try to connect to the existing instance instead of launching one of its own.

## Packaging for distribution

```
yarn bundle
```

## Development guide

[./docs/DEV_GUIDE.md](./docs/DEV_GUIDE.md)

### Upgrading electron version

When upgrading, upload debug symbols to sentry:
```
node sentry-symbols.js
```
https://docs.sentry.io/platforms/javascript/electron/#uploading-debug-information
