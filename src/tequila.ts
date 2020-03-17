/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { TequilapiClient, TequilapiClientFactory } from "mysterium-vpn-js"

const factory = new TequilapiClientFactory("http://localhost:4050")
const tequilapi: TequilapiClient = factory.build(factory.buildAdapter())

export default tequilapi
