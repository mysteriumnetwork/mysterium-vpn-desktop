/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { observer } from "mobx-react-lite"
import { IdentityRegistrationStatus } from "mysterium-vpn-js"
import React from "react"
import { comparer, reaction, when } from "mobx"

import { LoadingView } from "../../../views/common/Loading/LoadingView"
import { Step, useStores } from "../../../store"
import { log } from "../../../../shared/log/log"

const displayRegistrationStatus = (s?: IdentityRegistrationStatus): string => {
    switch (s) {
        case IdentityRegistrationStatus.Unknown:
            return "Unable to check"
        case IdentityRegistrationStatus.Unregistered:
            return "Waiting for tokens to arrive"
        case IdentityRegistrationStatus.InProgress:
            return "Registering MysteriumID"
        case IdentityRegistrationStatus.Registered:
            return "Registered"
        case IdentityRegistrationStatus.RegistrationError:
            return "Registration Failed"
    }
    return ""
}

export const IdentityRegistrationView: React.FC = observer(function IdentityRegistrationView() {
    const root = useStores()
    const { identity } = root
    const statusDisplay = displayRegistrationStatus(identity.identity?.registrationStatus)
    reaction(
        () => identity.identity?.balanceTokens,
        async (balance, prev) => {
            log.debug(`[event] Balance changed: ${prev?.ether} -> ${balance?.ether}`)
            switch (identity.identity?.registrationStatus) {
                case IdentityRegistrationStatus.Unregistered:
                case IdentityRegistrationStatus.RegistrationError:
                    if (await identity.balanceSufficientToRegister()) {
                        root.startupSequence(Step.IDENTITY_REGISTER)
                    }
            }
        },
        { equals: comparer.structural },
    )
    when(
        () => identity.identity?.registrationStatus === IdentityRegistrationStatus.Registered,
        () => {
            root.startupSequence(Step.IDENTITY_REGISTER_DONE)
        },
    )
    return <LoadingView status={statusDisplay} />
})
