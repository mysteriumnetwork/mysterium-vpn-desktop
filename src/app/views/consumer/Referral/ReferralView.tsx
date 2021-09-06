/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useEffect } from "react"
import { observer } from "mobx-react-lite"
import styled from "styled-components"
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons"
import { faTwitter, faFacebook } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { shell } from "electron"

import { useStores } from "../../../store"
import { Clipboard } from "../../../ui-kit/components/Clipboard/Clipboard"
import { BrandButton } from "../../../ui-kit/components/Button/BrandButton"
import { bg1 } from "../../../ui-kit/colors"

const Container = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    background: ${bg1};
    background-position: 0 -5px;
    overflow: hidden;
    align-items: center;
    justify-content: center;
    color: #fff;
`

const Column = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

const Row = styled.div`
    display: flex;
    align-items: center;
`

const Spinner = styled.div`
    margin-top: 50%;
    width: 100px;
    height: 100px;
`

const IconSpin = styled(FontAwesomeIcon)`
    margin-left: 8px;
    animation: fa-spin 0.7s infinite linear;
`

const TransparentButton = styled(BrandButton)`
    background: none;
`

const MYST_APP_URL = "https://mysterium.network/apps"

const shareMessage = (token: string): string => {
    return `Download Mysterium VPN App and use the referral code ${token} for free MYST`
}

const facebookLink = (token: string): JSX.Element => {
    const encodedQuote = encodeURI(shareMessage(token))
    const encodedUrl = encodeURI(MYST_APP_URL)
    return (
        <TransparentButton
            onClick={() =>
                shell.openExternal(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedQuote}`)
            }
            style={{ marginRight: "24px" }}
        >
            <FontAwesomeIcon size="3x" icon={faFacebook} color="#fff" />
        </TransparentButton>
    )
}

const twitterLink = (token: string): JSX.Element => {
    const encoded = encodeURI(`${shareMessage(token)}\n\n${MYST_APP_URL}`)
    return (
        <TransparentButton onClick={() => shell.openExternal(`https://twitter.com/intent/tweet?text=${encoded}`)}>
            <FontAwesomeIcon size="3x" icon={faTwitter} color="#fff" />
        </TransparentButton>
    )
}

const ReferralView: React.FC = observer(() => {
    const { referral, identity } = useStores()

    const { token, message, loading } = referral

    useEffect(() => {
        referral.generateToken()
    }, [identity.identity])

    const header =
        !token || message ? (
            <>
                <h2>No referral token is available at this time.</h2>
                <h3>Please try again later.</h3>
            </>
        ) : (
            <>
                <h2>Your referral code</h2>
                <Row>
                    <h1>{token}</h1>
                    <div style={{ marginLeft: "16px" }}>
                        <Clipboard text={token} size="2x" />
                    </div>
                </Row>
                <Row>
                    {facebookLink(token)}
                    {twitterLink(token)}
                </Row>
            </>
        )

    return (
        <Container>
            <Column>
                {loading ? (
                    <Spinner>
                        <IconSpin size="3x" icon={faCircleNotch} color="#fff" />
                    </Spinner>
                ) : (
                    header
                )}
            </Column>
        </Container>
    )
})

export default ReferralView
