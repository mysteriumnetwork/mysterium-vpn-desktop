/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import tequilapi from "mysterium-vpn-js"
import { action } from "mobx"
import { Issue } from "mysterium-vpn-js/lib/feedback/issue"

import { RootStore } from "../store"

export class FeedbackStore {
    root: RootStore

    constructor(root: RootStore) {
        this.root = root
    }

    @action
    async reportIssue(issue: Issue): Promise<void> {
        const issueId = await tequilapi.reportIssue(issue)
        console.log(issueId)
    }
}
