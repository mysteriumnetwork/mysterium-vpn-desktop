/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { action, observable } from "mobx"
import { Issue } from "mysterium-vpn-js/lib/feedback/issue"

import { RootStore } from "../store"
import { tequilapi } from "../tequilapi"

export class FeedbackStore {
    root: RootStore

    @observable
    loading = false

    constructor(root: RootStore) {
        this.root = root
    }

    @action
    async reportIssue(issue: Issue): Promise<string> {
        this.setLoading(true)
        try {
            const issueId = await tequilapi.reportIssue(issue)
            return issueId.issueId
        } finally {
            this.setLoading(false)
        }
    }

    @action
    setLoading = (b: boolean): void => {
        this.loading = b
    }
}
