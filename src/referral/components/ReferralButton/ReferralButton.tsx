/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react"
import styled from "styled-components"
import { faRetweet } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { observer } from "mobx-react-lite"
import * as _ from "lodash"

import { NavToggle } from "../../../ui-kit/components/Toggle/NavToggle"
import { brandDarker } from "../../../ui-kit/colors"
import { useStores } from "../../../store"

const ReferralToggle = styled(NavToggle)`
    padding: 0 8px;
`

const Icon = styled.div`
    height: 100%;
    padding: 0 4px;
    line-height: 24px;
`

export const ReferralButton: React.FC = observer(() => {
    const {
        navigation: { referrals: active, toggleReferrals },
        referral,
        identity: { identity },
    } = useStores()

    const tryGeneratingToken = () => {
        if (identity && !active) {
            _.throttle(() => referral.generateToken(identity.id), 60_000)()
        }
    }

    return (
        <ReferralToggle
            small
            onClick={(): void => {
                toggleReferrals()
                tryGeneratingToken()
            }}
            active={active}
        >
            <Icon>
                <FontAwesomeIcon icon={faRetweet} color={active ? "#fff" : brandDarker} />
            </Icon>
            <span>Referrals</span>
        </ReferralToggle>
    )
})
