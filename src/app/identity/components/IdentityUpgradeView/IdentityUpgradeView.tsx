/**
 * Copyright (c) 2022 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { observer } from "mobx-react-lite"
import React, { useEffect } from "react"
import { toast } from "react-hot-toast"

import { LoadingView } from "../../../views/common/Loading/LoadingView"
import { useStores } from "../../../store"

export const IdentityUpgradeView: React.FC = observer(function IdentityUpgradeView() {
    const { identity, navigation } = useStores()
    useEffect(() => {
        identity
            .upgrade()
            .then(() => {
                toast.success("ID upgraded! Balance will refresh within 1-3 minutes.")
                navigation.navigateToInitialRoute()
            })
            .catch(() => {
                toast.error("Failed to upgrade ID (restart and try again)")
            })
    }, [])
    return <LoadingView status="Upgrading identity compatibility (<1 minute)..." />
})
