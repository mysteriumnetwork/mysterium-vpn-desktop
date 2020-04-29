/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
export enum Category {
    App = "App",
    Tray = "Tray",
    Onboarding = "Onboarding",
    Identity = "Identity",
    Proposal = "Proposal",
    Connection = "Connection",
    Wallet = "Wallet",
}

export type Action =
    | AppAction
    | TrayAction
    | OnboardingAction
    | IdentityAction
    | ProposalAction
    | ConnectAction
    | WalletAction

export enum AppAction {
    HardQuit = "Hard quit",
    CloseWindow = "Close window",
    MinimizeWindow = "Minimize window",
}

export enum TrayAction {
    ShowWindow = "Show window",
    Quit = "Quit",
    Repair = "Repair",
}

export enum OnboardingAction {
    GetStarted = "Get started",
    ScrollTerms = "Scroll terms",
    CheckBoxAgreeToTerms = "Check box agree to terms",
    AcceptTerms = "Accept terms",
}

export enum IdentityAction {
    RegistrationInProgress = "Registration in progress",
    Registered = "Identity registered",
}

export enum ProposalAction {
    CustomFilter = "Custom filter",
    TextFilter = "Text filter",
    PriceFilterPerMinute = "Price filter / minute",
    PriceFilterPerGib = "Price filter / GiB",
    QualityFilterLevel = "Quality filter level",
    QualityFilterIncludeUnreachable = "Quality filter include unreachable",
    IpTypeFilter = "IP type filter",
    CountryFilter = "Country filter",
    SelectProposal = "Select proposal",
}

export enum ConnectAction {
    Connect = "Connect",
    Disconnect = "Disconnect",
    Cancel = "Cancel",
    StatusChanged = "Connected",
}

export enum WalletAction {
    Topup = "Wallet top-up",
}
