export const onProcessExit = (hook : Function) => {
    const shutdown = () => {
        console.log("Shutting down...")
        hook()
        process.exit(0)
    }
    process.on("beforeExit", shutdown)
    process.on("SIGINT", shutdown)
    process.on("SIGTERM", shutdown)
    process.on("SIGUSR1", shutdown)
    process.on("SIGUSR2", shutdown)
    process.on("uncaughtException", shutdown)
}
