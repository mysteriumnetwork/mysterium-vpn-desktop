/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Menu, MenuItemConstructorOptions } from "electron"

import * as packageJson from "../../package.json"

export const createMenu = (): Menu => {
    const template: MenuItemConstructorOptions[] = [
        {
            label: packageJson.productName,
            submenu: [
                { role: "about" },
                { type: "separator" },
                { role: "hide" },
                { role: "hideOthers" },
                { role: "unhide" },
                { type: "separator" },
                { role: "quit" },
            ],
        },
        {
            label: "Edit",
            submenu: [{ role: "copy" }, { role: "paste" }],
        },
        {
            role: "window",
            submenu: [{ role: "minimize" }, { role: "close" }],
        },
    ]
    return Menu.buildFromTemplate(template)
}
