/**
 * Copyright (c) 2022 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { observer } from "mobx-react-lite"

import { useStores } from "../../../store"
import { Select } from "../../../ui-kit/form-components/Select"
import { STATES } from "../../../location/states"

export const SelectTaxState: React.FC = observer(() => {
    const { payment } = useStores()
    const options = STATES[payment.taxCountry ?? ""]
    return (
        <div>
            <Select
                id="taxState"
                value={payment.taxState}
                onChange={(event) => payment.setTaxState(event.target.value)}
            >
                <option key="" value=""></option>
                {Object.entries(options).map(([key, val]) => (
                    <option key={key} value={key}>
                        {val}
                    </option>
                ))}
            </Select>
        </div>
    )
})
