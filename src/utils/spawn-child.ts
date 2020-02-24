import {ChildProcess, SpawnOptions} from "child_process";

const spawn = require("child_process").spawn;

let children: ChildProcess[] = []

export const registerExitHooks = () => {
    process.on("exit", () => {
        console.log("Killing", children.length, "child processes")
        children.forEach(c => c.kill())
    })
    const cleanExit = () => {
        process.exit()
    }
    process.on("SIGINT", cleanExit)
    process.on("SIGTERM", cleanExit)
    process.on("uncaughtException", () => cleanExit())
    process.on("SIGUSR1", () => cleanExit())
    process.on("SIGUSR2", () => cleanExit())
}

export const spawnChild = (command: string, args: ReadonlyArray<string>, options?: SpawnOptions) => {
    const child = spawn(command, args, options);
    registerChild(child)
    child.stdout.setEncoding("utf8")
    child.stdout.on("data", (data: any) => console.log(data.toString()))
    child.stderr.on("data", (data: any) => console.log(data.toString()))
    child.on("close", (code: number) => {
        console.log("Child exited with code:", code)
        unregisterChild(child)
    })
}

const registerChild = (proc: ChildProcess) => {
    children.push(proc)
}

const unregisterChild = (proc: ChildProcess) => {
    children = children.filter(c => c.pid !== proc.pid)
}
