/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
declare module "byte-size" {
    type ByteSize = {
        value: string
        unit: string
        long: string
        toString(): string
    }
    const byteSize: (
        bytes: number,
        options?: { precision?: number; units?: "metric" | "iec" | "metric_octet" | "iec_octet" },
    ) => ByteSize
    export default byteSize
}

declare module "@mysteriumnetwork/terms" {
    const TermsEndUser: string
}

// static assets /static
declare const __static: string

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Electron {
    export interface App {
        quitting?: boolean
    }
}
