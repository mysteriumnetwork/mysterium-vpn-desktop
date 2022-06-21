/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { observer } from "mobx-react-lite"
import React, { useState } from "react"
import { faFileImport, faIdCardAlt, faUserPlus } from "@fortawesome/free-solid-svg-icons"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Lottie from "react-lottie-player"
import toast from "react-hot-toast"

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
import { ImportIdentityFormFields, ImportIdentityPrompt } from "../../../views/common/Settings/ImportIdentityPrompt"
import { brandLight } from "../../../ui-kit/colors"

import animationIdentity from "./animation_identity.json"

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
`

export const IdentitySetup: React.FC = observer(function IdentitySetup() {
    const { onboarding, identity } = useStores()

    const handleCreateNew = async () => {
        await onboarding.createNewID()
    }
    const [importPrompt, setImportPrompt] = useState(false)
    const [importFilename, setImportFilename] = useState("")
    const handleImportExisting = async () => {
        const filename = await identity.importIdentityChooseFile()
        if (!filename) {
            return
        }
        setImportFilename(filename)
        setImportPrompt(true)
    }
    const handleImportSubmit = async ({ passphrase }: ImportIdentityFormFields) => {
        setImportPrompt(false)
        const res = identity.importIdentity({ filename: importFilename, passphrase })
        toast
            .promise(res, {
                loading: "Importing identity...",
                success: function successToast() {
                    return (
                        <span>
                            <b>Mysterium ID imported!</b>
                        </span>
                    )
                },
                error: function errorToast(reason) {
                    return (
                        <span>
                            <b>Mysterium ID import failed 😶</b>
                            <br />
                            Error: {reason}
                        </span>
                    )
                },
            })
            .then(() => onboarding.finishIDSetup())
    }
    const handleImportCancel = () => {
        setImportPrompt(false)
    }
    return (
        <ViewContainer>
            <ViewNavBar />
            <ViewSplit>
                <ViewSidebar>
                    <SideTop>
                        <SectionIcon icon={faIdCardAlt} />
                        <Title>Mysterium ID</Title>
                        <Small>Your anonymous keys to access Mysterium Network.</Small>
                    </SideTop>
                    <SideBot>
                        <PrimarySidebarActionButton onClick={handleCreateNew}>
                            <ButtonContent>
                                <ButtonIcon>
                                    <FontAwesomeIcon icon={faUserPlus} />
                                </ButtonIcon>
                                Create New
                            </ButtonContent>
                        </PrimarySidebarActionButton>
                        <SecondarySidebarActionButton onClick={handleImportExisting}>
                            <ButtonContent>
                                <ButtonIcon>
                                    <FontAwesomeIcon icon={faFileImport} />
                                </ButtonIcon>
                                Import existing
                            </ButtonContent>
                        </SecondarySidebarActionButton>
                    </SideBot>
                </ViewSidebar>
                <Content>
                    <Lottie
                        play
                        loop={false}
                        animationData={animationIdentity}
                        style={{ width: 256, height: 256 }}
                        renderer="svg"
                    />
                </Content>
            </ViewSplit>
            <ImportIdentityPrompt visible={importPrompt} onSubmit={handleImportSubmit} onCancel={handleImportCancel} />
        </ViewContainer>
    )
})
