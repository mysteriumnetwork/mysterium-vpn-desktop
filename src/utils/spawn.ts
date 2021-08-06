/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { ChildProcess, spawn, SpawnOptions } from "child_process"

import { log } from "../shared/log/log"

/**
 * Wrapper for `spawn` that prints cmd and args.
 * @param command
 * @param args
 * @param options
 */
export const spawnProcess = (
    command: string,
    args: ReadonlyArray<string>,
    options: SpawnOptions = {},
): ChildProcess => {
    log.info("Spawning a child process: ", command, ...args.map((a) => (a.indexOf(" ") != -1 ? `'${a}'` : a)))
    return spawn(command, args, options)
}
