# mysterium-vpn-desktop

[![GitHub release (latest by date)](https://img.shields.io/github/v/release/mysteriumnetwork/mysterium-vpn-desktop)](https://github.com/mysteriumnetwork/mysterium-vpn-desktop/releases/latest)
[![Downloads](https://img.shields.io/github/downloads/mysteriumnetwork/mysterium-vpn-desktop/total.svg)](https://github.com/mysteriumnetwork/mysterium-vpn-desktop/releases)
[![Lint](https://github.com/mysteriumnetwork/mysterium-vpn-desktop/workflows/Lint/badge.svg?event=push)](https://github.com/mysteriumnetwork/mysterium-vpn-desktop/actions?query=workflow%3ALint)

Mysterium VPN is a Desktop VPN client for Windows, macOS and Linux.

It is the first Mysterium Network use case in action. Our dVPN is our flagship product and showcases the potential of our residential IP network. [Learn more](https://docs.mysterium.network/)

## Usage

You can download the latest version from [releases](https://github.com/mysteriumnetwork/mysterium-vpn-desktop/releases) page. After installation, run MysteriumVPN to get started.

### Usage: Linux

- Download `*.deb` package from [releases](https://github.com/mysteriumnetwork/mysterium-vpn-desktop/releases)
- Install app with dependencies: `sudo apt install ./name-of-deb-package.deb`

## Logs

Logs help to debug issues when something goes wrong. Make sure to attach all of them when submitting a bug report.

### Windows

- `%USERPROFILE%\AppData\Roaming\MysteriumVPN\logs` (app)
- `%USERPROFILE%\.mysterium\logs\mysterium-node.log` (node)
- `%PROGRAMDATA%\MystSupervisor\myst_supervisor.log` (supervisor)

### macOS

- `~/Library/Logs/MysteriumVPN` (app)
- `~/.mysterium/logs/mysterium-node.log` (node)
- `/var/log/myst_supervisor.log` (supervisor)

### Linux

- `~/.config/MysteriumVPN/logs` (app)
- `~/.mysterium/logs/mysterium-node.log` (node)
- `/var/log/myst_supervisor.log` (supervisor)

** Note: In development mode, application logs are printed to the console

## Development

Pre-requisites:
- Node 14 LTS
- yarn

1. Install and build the project
    ```
    yarn && yarn build
    ```
2. Start (webpack dev server with hot reload):

    ```
    yarn dev
    ```

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
