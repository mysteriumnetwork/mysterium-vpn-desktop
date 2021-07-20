/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { action, makeObservable, observable, observe } from "mobx"
import { History, Location, LocationListener, UnregisterCallback } from "history"

import { pageview } from "../analytics/analytics"

import { AppLocation } from "./locations"

export class RouterStore {
    location: Location = {
        pathname: "",
        search: "",
        state: "",
        hash: "",
    }

    history: SynchronizedHistory | undefined

    constructor() {
        makeObservable(this, {
            location: observable,
            updateLocation: action,
        })
    }

    updateLocation = (newLocation: Location): void => {
        this.location = newLocation
    }

    push = (loc: AppLocation): void => {
        pageview({
            documentTitle: loc.title,
            href: loc.path,
        })
        this.history?.push(loc.path)
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
