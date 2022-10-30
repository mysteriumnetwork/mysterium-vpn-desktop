/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { observer } from "mobx-react-lite"
import React, { useState } from "react"
import { faFileExport, faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Lottie from "react-lottie-player"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

import { ViewContainer } from "../../../navigation/components/ViewContainer/ViewContainer"
import { ViewSplit } from "../../../navigation/components/ViewSplit/ViewSplit"
import { ViewSidebar } from "../../../navigation/components/ViewSidebar/ViewSidebar"
import { ViewContent } from "../../../navigation/components/ViewContent/ViewContent"
import { ViewNavBar } from "../../../navigation/components/ViewNavBar/ViewNavBar"
import { Heading2, Small } from "../../../ui-kit/typography"
import {
    ButtonContent,
    ButtonIcon,
    PrimarySidebarActionButton,
    SecondarySidebarActionButton,
} from "../../../ui-kit/components/Button/SidebarButtons"
import { useStores } from "../../../store"
import { ExportIdentityFormFields, ExportIdentityPrompt } from "../../../views/common/Settings/ExportIdentityPrompt"
import { brandLight } from "../../../ui-kit/colors"
import { dismissibleToast } from "../../../ui-kit/components/dismissibleToast"

import animationIdentityKeys from "./animation_identity_keys.json"

const SideTop = styled.div`
    box-sizing: border-box;
    height: 136px;
    padding: 20px;
    overflow: hidden;
    text-align: center;
`

const SectionIcon = styled(FontAwesomeIcon)`
    margin-bottom: 15px;
    font-size: 20px;
    color: ${brandLight};
`

const Title = styled(Heading2)`
    margin-bottom: 15px;
`

const SideBot = styled.div`
    background: #fff;
    box-shadow: 0px 0px 30px rgba(11, 0, 75, 0.1);
    border-radius: 10px;
    box-sizing: border-box;
    padding: 20px;
    flex: 1 0 auto;

    display: flex;
    flex-direction: column;
`

const Content = styled(ViewContent)`
    background: none;
    justify-content: center;
`

export const IdentityBackup: React.FC = observer(function IdentityBackup() {
    const { onboarding, identity } = useStores()

    const navigate = useNavigate()
    const nextStep = () => {
        onboarding.finishIDSetup()
    }

    const [exportPrompt, setExportPrompt] = useState(false)
    const handleBackupNow = () => {
        setExportPrompt(true)
    }
    const handleExportSubmit = async ({ passphrase }: ExportIdentityFormFields) => {
        setExportPrompt(false)
        try {
            await identity.exportIdentity({ id: identity.identity?.id ?? "", passphrase })
            nextStep()
        } catch (reason) {
            toast.error(
                dismissibleToast(
                    <span>
                        <>
                            <b>Identity backup failed 😶</b>
                            <br />
                            Error: {reason}
                        </>
                    </span>,
                ),
            )
        }
    }
    const handleExportCancel = () => {
        setExportPrompt(false)
    }
    return (
        <ViewContainer>
            <ViewNavBar />
            <ViewSplit>
                <ViewSidebar>
                    <SideTop>
                        <SectionIcon icon={faFileExport} />
                        <Title>Create backup</Title>
                        <Small>We don&apos;t store any account data. Back up to keep your tokens safe.</Small>
                    </SideTop>
                    <SideBot>
                        <PrimarySidebarActionButton onClick={handleBackupNow}>
                            <ButtonContent>
                                <ButtonIcon>
                                    <FontAwesomeIcon icon={faFileExport} />
                                </ButtonIcon>
                                Backup Private Key
                            </ButtonContent>
                        </PrimarySidebarActionButton>
                        <SecondarySidebarActionButton onClick={() => navigate(-1)}>
                            <ButtonContent>
                                <ButtonIcon>
                                    <FontAwesomeIcon icon={faArrowAltCircleLeft} />
                                </ButtonIcon>
                                Go Back
                            </ButtonContent>
                        </SecondarySidebarActionButton>
                    </SideBot>
                </ViewSidebar>
                <Content>
                    <Lottie
                        play
                        loop={false}
                        animationData={animationIdentityKeys}
                        style={{ width: 256, height: 256 }}
                        renderer="svg"
                    />
                </Content>
            </ViewSplit>
            <ExportIdentityPrompt visible={exportPrompt} onSubmit={handleExportSubmit} onCancel={handleExportCancel} />
        </ViewContainer>
    )
})
