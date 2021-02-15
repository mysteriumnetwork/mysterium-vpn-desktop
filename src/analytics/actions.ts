/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
export enum Category {
    UserAction = "User Action",
    AppState = "App state",
}

export enum OnboardingAction {
    GetStarted = "Get started",
    TermsScroll = "Terms scroll",
    AcceptTermsCheckbox = "Accept terms: checkbox",
    AcceptTermsContinue = "Accept terms: continue",
}

export enum ProposalViewAction {
    FilterCountry = "Filter: country",
    FilterText = "Filter: text",
    FilterPriceTime = "Filter: price/time",
    FilterPriceData = "Filter: price/data",
    FilterQuality = "Filter: quality",
    FilterIpType = "Filter: IP type",
    FilterIncludeFailed = "Filter: include failed",
    FilterReset = "Filter: reset",
    SelectProposal = "Select proposal",
}

export enum ConnectionAction {
    Connect = "Connect",
    Disconnect = "Disconnect",
}

export enum WalletAction {
    TopupModalOpen = "Topup modal open",
    TopupModalClose = "Topup modal close",
    ReceiveTokensOpen = "Receive tokens open",
    ReceiveTokensClose = "Receive tokens close",
    ChangeTopupAmount = "Change topup amount",
    ChangeTopupCurrency = "Change topup currency",
    UseLightningNetwork = "Use lightning network",
    CreatePayment = "Create payment",
    PayInBrowser = "Pay in browser",
}

export enum TrayAction {
    ShowWindow = "Tray: show window",
    CheckForUpdates = "Tray: check for updates",
    RepairSupervisor = "Tray: repair supervisor",
    Quit = "Tray: quit",
    DoubleClickActivate = "Tray: double click activate",
}

export enum OtherAction {
    PushNotificationClick = "Push notification: clicked",
    ToggleQrView = "Toggle QR view (image)",
    GetHelp = "Get help",
    GetHelpClose = "Get help: close",
    SocialFacebook = "Social: Facebook",
    SocialTwitter = "Social: Twitter",
    SocialMedium = "Social: Medium",
    SocialReddit = "Social: Reddit",
    SocialGithub = "Social: Github",
    MenuQuit = "Menu: quit",
    AboutApp = "About app",
    SetDnsOption = "Set DNS option",
    SubmitBugReport = "Submit bug report",
}

export type UserAction =
    | OnboardingAction
    | ProposalViewAction
    | ConnectionAction
    | TrayAction
    | OtherAction
    | WalletAction

export enum AppStateAction {
    DaemonStatus = "Daemon status",
    ConnectionStatus = "Connection status",
    BalanceChanged = "Balance changed",
    IdentityStatus = "Identity status",
    IdentityCreate = "Identity create",
    IdentityUnlock = "Identity unlock",
    IdentityRegister = "Identity register",
    PushNotificationShown = "Push notification shown",
    SupervisorConnected = "Supervisor connected",
    SupervisorInstall = "Supervisor install",
    OrderStatus = "Order status",
}
