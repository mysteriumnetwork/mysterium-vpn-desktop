/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
export const isProduction = (): boolean => process.env.NODE_ENV == "production"
export const isDevelopment = (): boolean => !isProduction()
