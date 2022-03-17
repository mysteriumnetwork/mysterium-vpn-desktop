/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { observer } from "mobx-react-lite"
import React from "react"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons"
import ReactTooltip from "react-tooltip"

import { ViewContent } from "../../../navigation/components/ViewContent/ViewContent"
import { useStores } from "../../../store"
import { Select } from "../../../ui-kit/form-components/Select"
import { Checkbox } from "../../../ui-kit/form-components/Checkbox/Checkbox"

const Section = styled(ViewContent)`
    padding: 20px;
    margin-bottom: 10px;
`

const FormRow = styled.div`
    width: 100%;
    height: 45px;
    display: flex;
    flex-direction: row;
`

const FormLabel = styled.div`
    font-weight: bold;
    width: 50%;
    display: flex;
    align-items: center;
`

const FormValue = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
`

const Tooltip = styled(ReactTooltip).attrs({
    effect: "solid",
})`
    width: 200px;
`

const TooltipIcon = styled(FontAwesomeIcon).attrs({
    icon: faQuestionCircle,
})`
    margin-left: 10px;
`

export const SettingsConnection: React.FC = observer(function SettingsConnection() {
    const { config } = useStores()
    const onDnsOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const val = event.target.value
        config.setDnsOption(val)
    }
    return (
        <>
            <Section>
                <FormRow>
                    <Tooltip id="dns-server-tooltip">
                        <span>
                            Domain Name System (DNS) is used to resolve internet addresses. <br />
                            <b>Provider</b> - maximum privacy
                            <br />
                            <b>Automatic</b> - maximum reliability <br />
                            <br />
                            You will need to re-connect for the change to apply.
                        </span>
                    </Tooltip>
                    <FormLabel>
                        DNS server <TooltipIcon data-tip="" data-for="dns-server-tooltip" />
                    </FormLabel>
                    <FormValue>
                        <Select id="dns" value={config.dnsOption} onChange={onDnsOptionChange}>
                            <option value="1.1.1.1">Cloudflare</option>
                            <option value="auto">Automatic</option>
                            <option value="provider">Provider</option>
                            <option value="system">System</option>
                        </Select>
                    </FormValue>
                </FormRow>
                <FormRow>
                    <Tooltip id="nat-type-detection-tooltip">
                        <span>
                            Use automatic NAT type detection to filter out incompatible providers. <br />
                            It increases your chances of successfully connecting to provider nodes. <br />
                            Disable to see all provider nodes.
                        </span>
                    </Tooltip>
                    <FormLabel>
                        NAT type detection <TooltipIcon data-tip="" data-for="nat-type-detection-tooltip" />
                    </FormLabel>
                    <FormValue>
                        <Checkbox
                            checked={config.autoNATCompatibility}
                            onChange={(event): void => {
                                const val = event.target.checked
                                config.setAutoNATCompatibility(val)
                            }}
                        />
                    </FormValue>
                </FormRow>
                <FormRow>
                    <Tooltip id="kill-switch-tooltip">
                        <span>
                            If you lose your VPN connection, a kill switch can automatically disconnect your device from
                            your internet connection to ensure your privacy remains intact until your VPN connection is
                            restored.
                        </span>
                    </Tooltip>
                    <FormLabel>
                        Kill switch <TooltipIcon data-tip="" data-for="kill-switch-tooltip" />
                    </FormLabel>
                    <FormValue>
                        <Checkbox
                            checked={config.killSwitch}
                            onChange={(event): void => {
                                const val = event.target.checked
                                config.setKillSwitch(val)
                            }}
                        />
                    </FormValue>
                </FormRow>
            </Section>
        </>
    )
})
