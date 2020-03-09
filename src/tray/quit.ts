import { QAction } from "@nodegui/nodegui"
import { rootStore } from "../store"
import { ConnectionStatus as ConnectionStatusType } from "mysterium-vpn-js/lib/connection/status"

export const quitAction = (): QAction => {
    const quitAction = new QAction()
    quitAction.setText("Quit")
    quitAction.addEventListener("triggered", async () => {
        if (rootStore.connection.status == ConnectionStatusType.CONNECTED) {
            await rootStore.connection.disconnect()
        }
        process.emit("beforeExit", 0)
    })
    return quitAction
}
