/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useEffect } from "react"
import { observer } from "mobx-react-lite"
import _ from "lodash"

import { useStores } from "../../../store"
import { Select } from "../../../ui-kit/form-components/Select"
import { countryNames } from "../../../location/countries"

export const SelectTaxCountry: React.FC = observer(() => {
    const { payment, connection } = useStores()
    useEffect(() => {
        if (payment.taxCountry) {
            return
        }
        const countryFromLocation = connection.originalLocation?.country
        payment.setTaxCountry(countryFromLocation)
    }, [])
    const options = _.mapKeys(countryNames, (value, key) => key.toUpperCase())
    return (
        <div>
            <Select
                id="taxCountry"
                value={payment.taxCountry}
                onChange={(event) => payment.setTaxCountry(event.target.value)}
            >
                {Object.entries(options).map(([key, val]) => (
                    <option key={key} value={key}>
                        {val}
                    </option>
                ))}
            </Select>
        </div>
    )
})
