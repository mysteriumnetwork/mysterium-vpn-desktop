/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { QAction } from "@nodegui/nodegui"
import { ConnectionStatus as ConnectionStatusType } from "mysterium-vpn-js/lib/connection/status"

import { rootStore } from "../store"

export const repairAction = (): QAction => {
    const quitAction = new QAction()
    quitAction.setText("Repair myst")
    quitAction.addEventListener("triggered", async () => {
        if (rootStore.connection.status == ConnectionStatusType.CONNECTED) {
            await rootStore.connection.disconnect()
        }
        await rootStore.daemon.supervisorInstall()
    })
    return quitAction
}
