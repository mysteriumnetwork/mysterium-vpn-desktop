/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { set, transform } from "lodash"
import { camelCase, isArray, isObjectLike, isPlainObject, map } from "lodash/fp"

const createIteratee = (converter: (string: string) => string, self: any) => {
    return (result: any, value: any, key: string): any =>
        set(result, converter(key), isObjectLike(value) ? self(value) : value)
}

export const camelKeys = (node: any): any => {
    if (isArray(node)) return map(camelKeys, node)
    if (isPlainObject(node)) return transform(node, createIteratee(camelCase, camelKeys))
    return node
}
