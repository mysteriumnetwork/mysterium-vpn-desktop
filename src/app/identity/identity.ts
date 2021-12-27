/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Identity, IdentityRegistrationStatus } from "mysterium-vpn-js"

export const registered = (id: Identity): boolean =>
    [IdentityRegistrationStatus.Registered].includes(id.registrationStatus)
