# mysterium-vpn2

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
2. Start:

    a. Webpack dev server (with hot reload)
    ```
    yarn dev
    ```
    b. App (run in separate tab)
    ```
    yarn start
    ```

## Packaging for distribution

In package.json, change the signing key that is passed to [nodegui-packer](https://github.com/nodegui/packer). Then:

```
yarn build
yarn packer
```

## Development guide

[./docs/DEV_GUIDE.md](./docs/DEV_GUIDE.md)
