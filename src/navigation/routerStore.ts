/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { action, observable, observe } from "mobx"
import { History, Location, LocationListener, Path, UnregisterCallback } from "history"

import { analytics } from "../analytics/analytics-ui"

export class RouterStore {
    @observable
    location: Location = {
        pathname: "",
        search: "",
        state: "",
        hash: "",
    }

    history: SynchronizedHistory | undefined

    @action
    updateLocation = (newLocation: Location): void => {
        this.location = newLocation
    }

    push = (path: Path): void => {
        analytics.pageview(path)
        this.history?.push(path)
    }
}

interface SynchronizedHistory extends History {
    subscribe: (listener: LocationListener) => UnregisterCallback
    unsubscribe: UnregisterCallback
}

export const synchronizedHistory = (history: History, store: RouterStore): History => {
    store.history = history as SynchronizedHistory
    const handleLocationChange = (location: Location) => {
        store.updateLocation(location)
    }
    const unsubscribeFromHistory = history.listen(handleLocationChange)
    handleLocationChange(history.location)

    const subscribe = (listener: LocationListener): UnregisterCallback => {
        const unsubscribeFromStore = observe(store, "location", ({ newValue }) => {
            const rawLocation = { ...(newValue as Location) }
            listener(rawLocation, history.action)
        })
        listener(store.location, history.action)
        return unsubscribeFromStore
    }

    store.history.subscribe = subscribe
    store.history.unsubscribe = unsubscribeFromHistory
    return store.history
}
