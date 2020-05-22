/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Identity, IdentityRegistrationStatus } from "mysterium-vpn-js"

export const registered = (id: Identity): boolean =>
    // After fast registration, identity is already usable in 'InProgress' status
    [IdentityRegistrationStatus.RegisteredConsumer, IdentityRegistrationStatus.InProgress].includes(
        id.registrationStatus,
    )

export const eligibleForRegistration = (id: Identity): boolean =>
    [IdentityRegistrationStatus.Unregistered, IdentityRegistrationStatus.RegistrationError].includes(
        id.registrationStatus,
    )
