import {QAction} from "@nodegui/nodegui";
import {rootStore} from "../store";
import {ConnectionStatus as ConnectionStatusType} from "mysterium-vpn-js/lib/connection/status";

export const repairAction = (): QAction => {
    const quitAction = new QAction();
    quitAction.setText("Repair myst")
    quitAction.addEventListener("triggered", async () => {
        if (rootStore.connection.status == ConnectionStatusType.CONNECTED) {
            await rootStore.connection.disconnect()
        }
        await rootStore.daemon.supervisorInstall()
    })
    return quitAction
}
