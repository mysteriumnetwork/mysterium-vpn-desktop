/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { observer } from "mobx-react-lite"
import { IdentityRegistrationStatus } from "mysterium-vpn-js"
import React from "react"

import { LoadingView } from "../../../views/common/Loading/LoadingView"
import { useStores } from "../../../store"

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
    const { identity } = useStores()
    const statusDisplay = displayRegistrationStatus(identity.identity?.registrationStatus)
    return <LoadingView status={statusDisplay} />
})
