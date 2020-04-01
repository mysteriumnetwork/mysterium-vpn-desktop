/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
declare module "byte-size" {
    const byteSize: (
        bytes: number,
        options?: { precision?: number; units?: "metric" | "iec" | "metric_octet" | "iec_octet" },
    ) => string
    export default byteSize
}

declare module "@mysteriumnetwork/terms" {
    const TermsEndUser: string
}
