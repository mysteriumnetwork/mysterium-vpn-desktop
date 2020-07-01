# mysterium-vpn-desktop

[![GitHub release (latest by date)](https://img.shields.io/github/v/release/mysteriumnetwork/mysterium-vpn-desktop)](https://github.com/mysteriumnetwork/mysterium-vpn-desktop/releases/latest)
[![Downloads](https://img.shields.io/github/downloads/mysteriumnetwork/mysterium-vpn-desktop/total.svg)](https://github.com/mysteriumnetwork/mysterium-vpn-desktop/releases)
[![Lint](https://github.com/mysteriumnetwork/mysterium-vpn-desktop/workflows/Lint/badge.svg?event=push)](https://github.com/mysteriumnetwork/mysterium-vpn-desktop/actions?query=workflow%3ALint)

This is a rewrite of [Mysterium VPN desktop](https://github.com/mysteriumnetwork/mysterium-vpn) with the following goals:
- Improved performance
- Improved UX
- Simplified codebase
- Integrated payments

## Logging

### App

In development mode, application logs are printed to the console.  
In a bundled application:

- Linux: `~/.config/MysteriumVPN/logs/*.log`
- macOS: `~/Library/Logs/MysteriumVPN/*.log`
- Windows: `%USERPROFILE%\AppData\Roaming\MysteriumVPN\logs\*.log`

### Node

`~/.mysterium/logs/mysterium-node.log`

### Supervisor

- Linux/macOS: `/var/log/myst_supervisor.log`
- Windows: `%PROGRAMDATA%\MystSupervisor\myst_supervisor.log`

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

Instead of using prebuilt Node binary (specified by `@mysteriumnetwork/node` version in `package.json`), you may build [Node](https://github.com/mysteriumnetwork/node) from sources and start it in daemon mode with required permissions, e.g.:

```
git clone https://github.com/mysteriumnetwork/node
cd node
mage build
mage daemon
```

App will try to connect to the existing instance instead of launching one of its own.

## Packaging for distribution

Required env variables (macOS):
- APPLEID
- APPLEIDPASS (generate an app-specific password for this)

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
