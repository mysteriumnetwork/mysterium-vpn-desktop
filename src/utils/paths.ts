/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as path from "path"

/**
 * Calculates asset path assuming it's in the same directory as dist/index.js.
 * @param assetPath
 */
export const fixAssetPath = (assetPath: string): string => path.join(__dirname, path.basename(assetPath))

/**
 * Calculates absolute static asset path.
 * @param assetPath
 */
export const staticAssetPath = (assetPath: string): string => path.join(__dirname, "static", assetPath)
