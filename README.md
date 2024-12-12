# mysterium-vpn-desktop

[![GitHub release (latest by date)](https://img.shields.io/github/v/release/mysteriumnetwork/mysterium-vpn-desktop)](https://github.com/mysteriumnetwork/mysterium-vpn-desktop/releases/latest)
[![Downloads](https://img.shields.io/github/downloads/mysteriumnetwork/mysterium-vpn-desktop/total.svg)](https://github.com/mysteriumnetwork/mysterium-vpn-desktop/releases)
[![Lint](https://github.com/mysteriumnetwork/mysterium-vpn-desktop/workflows/Lint/badge.svg?event=push)](https://github.com/mysteriumnetwork/mysterium-vpn-desktop/actions?query=workflow%3ALint)

## ⚠️ MysteriumVPN 2.0 for Desktop is available. https://www.mysteriumvpn.com

Mysterium VPN is a Desktop VPN client for Windows, macOS and Linux.

It is the first Mysterium Network use case in action. Our dVPN is our flagship product and showcases the potential of our residential IP network. [Learn more](https://docs.mysterium.network/)

## Usage

Download and install the [latest version](https://github.com/mysteriumnetwork/mysterium-vpn-desktop/releases/latest) for your platform. After installation, run MysteriumVPN to get started.

### Linux

#### Ubuntu/Debian

- Download the `.deb` package from [releases](https://github.com/mysteriumnetwork/mysterium-vpn-desktop/releases/latest)
- Install app with dependencies: 

```sh
sudo apt install ./package-name.deb
```

#### CentOS/Fedora/RHEL 

- Download the `.rpm` package from [releases](https://github.com/mysteriumnetwork/mysterium-vpn-desktop/releases/latest)
- Install app with dependencies: 

```sh
sudo dnf install package-name.rpm
```

### macOS

#### Manual Install

- Download the `.dmg` package from [releases](https://github.com/mysteriumnetwork/mysterium-vpn-desktop/releases/latest)
- Open the package and drag `MysteriumVPN.app` onto the `Applications` shortcut

#### Homebrew

- Mysterium VPN can also be installed with [Homebrew](https://brew.sh/):

```sh
brew install --cask mysteriumvpn
```

- Update

```sh
brew upgrade --cask mysteriumvpn
```

### Windows

#### Manual Install

- Download the `.exe` file from [releases](https://github.com/mysteriumnetwork/mysterium-vpn-desktop/releases/latest)
- Run the executable to install

#### Chocolatey

- Mysterium VPN can also be installed with [chocolatey](https://chocolatey.org/):

```pwsh
choco install -y mysteriumvpn
```

- Update

```pwsh
choco update -y mysteriumvpn
```

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
- Node >=16 LTS
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
- APPLETEAMID

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
