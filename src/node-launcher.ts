import * as path from "path";
import {isDevelopment, isProduction} from "./utils/mode";
import {spawnChild} from "./utils/spawn-child";

/**
 * Resolves node executable path for all supported platforms in development and production modes.
 * @return {string} Node executable path which can be used to spawn the node daemon.
 */
const nodeExecPath = (): string | undefined => {
    if (isProduction()) {
        switch (process.platform) {
            case "darwin":
                const qodeDir = path.dirname(process.execPath) // MysteriumVPN2.app/Contents/MacOS
                const appBundleRoot = path.resolve(qodeDir, "../../")
                const nodePath = "Contents/Resources/dist/node/myst"
                return path.resolve(appBundleRoot, nodePath)
            default:
                return undefined
        }
    }
    if (isDevelopment()) {
        return "./node/myst"
    }
}

export const launchDaemon = () => {
    try {
        const nodePath = nodeExecPath()
        if (!nodePath) {
            console.log("Could not determine node daemon path")
            process.exit(-5)
        }
        // fs.writeFileSync(path.join(os.homedir(), "test.txt"), nodePath);
        spawnChild(nodePath, ["daemon"])
    } catch (e) {
        console.log("Error running myst daemon", e)
        // try {
        //     // fs.writeFileSync(path.join(os.homedir(), "test.txt"), e);
        //
        // } catch (e) {
        //     console.error("Cannot write file ", e);
        // }
    }
}

