/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { action } from "mobx"
import tequilapi from "mysterium-vpn-js"

import { RootStore } from "../store"

export class PaymentStore {
    root: RootStore

    constructor(root: RootStore) {
        this.root = root
    }

    @action
    async topUp(): Promise<void> {
        return await tequilapi.topUp({
            identity: this.root.identity.identity?.id ?? "",
        })
    }
}
