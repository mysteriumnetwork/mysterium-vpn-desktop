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
    TermsScroll = "Terms scroll",
    AcceptTermsCheckbox = "Accept terms: checkbox",
    AcceptTermsContinue = "Accept terms: continue",
    CompleteIntro = "Onboarding: complete intro",
    SkipIntro = "Onboarding: skip intro",
    CreateID = "Onboarding: create ID",
    ImportID = "Onboarding: import ID",
    UseReferralCode = "Onboarding: use referral code",
    UseReferralCodeSubmit = "Onboarding: submit referral code",
    UseReferralCodeCancel = "Onboarding: cancel referral code",
    BackupIDNow = "Onboarding: backup ID now",
    BackupIDLater = "Onboarding: backup ID later",
    TopupNow = "Onboarding: top up now",
    TopupLater = "Onboarding: top up later",
}

export enum ProposalViewAction {
    FilterCountry = "Filter: country",
    FilterText = "Filter: text",
    FilterQuality = "Filter: quality",
    FilterIncludeFailed = "Filter: include failed",
    FilterReset = "Filter: reset",
    SelectProposal = "Select proposal",
}

export enum ConnectionAction {
    Connect = "Connect",
    Disconnect = "Disconnect",
}

export enum WalletAction {
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
    SupportChat = "Support chat",
    Documentation = "Documentation",
    SocialFacebook = "Social: Facebook",
    SocialDiscord = "Social: Discord",
    SocialTwitter = "Social: Twitter",
    SocialReddit = "Social: Reddit",
    SetDnsOption = "Set DNS option",
    SubmitBugReport = "Submit bug report",
    BackupID = "Backup ID",
    RestoreID = "Restore ID",
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
    ConnectedCountry = "Connected country",
    DisconnectedCountry = "Disconnected country",
    IdentityImported = "Identity imported",
    IdentityLoaded = "Identity loaded",
    IdentityStatus = "Identity status",
    IdentityCreated = "Identity create",
    IdentityUnlocked = "Identity unlock",
    IdentityRegistered = "Identity register",
    PaymentStatus = "Payment status",
    PushNotificationShown = "Push notification shown",
    SupervisorConnected = "Supervisor connected",
    SupervisorInstall = "Supervisor install",
    OrderStatus = "Order status",
}
