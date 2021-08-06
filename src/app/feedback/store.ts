/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { action, makeObservable, observable } from "mobx"
import { Issue } from "mysterium-vpn-js"

import { RootStore } from "../store"
import { tequilapi } from "../tequilapi"
import { log } from "../../shared/log/log"

export class FeedbackStore {
    root: RootStore

    loading = false

    constructor(root: RootStore) {
        makeObservable(this, {
            loading: observable,
            setLoading: action,
            reportIssue: action,
        })
        this.root = root
    }

    async reportIssue(issue: Issue): Promise<string> {
        this.setLoading(true)
        try {
            const issueId = await tequilapi.reportIssue(issue)
            return issueId.issueId
        } catch (err) {
            log.error("Could not submit the report", err.message)
            return Promise.reject(err.message)
        } finally {
            this.setLoading(false)
        }
    }

    setLoading = (b: boolean): void => {
        this.loading = b
    }
}
