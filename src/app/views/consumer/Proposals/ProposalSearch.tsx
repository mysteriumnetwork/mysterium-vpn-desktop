/**
 * Copyright (c) 2022 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useRef, useState } from "react"
import Autosuggest, { ChangeEvent } from "react-autosuggest"
import { observer } from "mobx-react-lite"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons"

import { UIProposal } from "../../../proposals/uiProposal"
import { useStores } from "../../../store"
import { darkBlue } from "../../../ui-kit/colors"
import { Small } from "../../../ui-kit/typography"
import { Flag } from "../../../location/components/Flag/Flag"

import Timeout = NodeJS.Timeout

const IconContainer = styled.div`
    width: 26px;
    height: 26px;
    &:hover {
        background: rgba(255, 255, 255, 0.2);
    }
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
`

const ProposalSearchContainer = styled.div`
    position: fixed;
    right: 48px;
    top: 48px;
    z-index: 10;

    & .react-autosuggest__container {
    }
    & .react-autosuggest__input {
        width: 300px;
        height: 30px;
        z-index: 10;
    }
    & .react-autosuggest__input--focused {
    }
    & .react-autosuggest__suggestions-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    & .react-autosuggest__suggestions-container {
        display: none;
        background-color: #fff;
        color: ${darkBlue};
        overflow: hidden;
        width: 306px;
        max-height: 280px;
        top: 35px;
        right: 0px;
    }

    & .react-autosuggest__suggestions-container--open {
        display: block;
        position: absolute;
        border: 1px solid #aaa;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        z-index: 2;
    }
    & .react-autosuggest__suggestion {
        cursor: pointer;
        padding: 10px 20px;
    }
    & .react-autosuggest__suggestion--highlighted {
        background-color: #ddd;
    }
`

const SuggestionHeader = styled.div`
    height: 20px;
    display: flex;
    align-items: center;

    & > span {
        margin-left: 5px;
    }
`

const filterProposalsAsync = (
    proposals: UIProposal[],
    query: string,
    options = { maxResults: 5, chunkSize: 100 },
): Promise<UIProposal[]> => {
    return new Promise<UIProposal[]>((resolve) => {
        if (query.length === 0) {
            return resolve([])
        }
        const filtered: UIProposal[] = []
        let i = 0

        function doChunk() {
            let cnt = options.chunkSize
            while (cnt-- && i < proposals.length) {
                if (proposals[i].providerId.indexOf(query) !== -1) {
                    filtered.push(proposals[i])
                    if (filtered.length >= options.maxResults) {
                        resolve(filtered)
                        return
                    }
                }
                ++i
            }
            const workToDo = i < proposals.length
            if (workToDo) {
                setTimeout(doChunk, 1) // Give other routines time to process
            } else {
                resolve(filtered)
            }
        }

        doChunk()
    })
}

export const ProposalSearch: React.FC = observer(function ProposalSearch() {
    const { proposals } = useStores()

    // Search box visibility
    const [visible, setVisible] = useState(false)

    const [lastRequestId, setLastRequestId] = useState<Timeout | null>(null)

    // Auto-suggest setup
    const autosuggestRef = useRef<Autosuggest<UIProposal>>(null)
    const [selection, setSelection] = useState<string>("")
    const [suggestions, setSuggestions] = useState<UIProposal[]>([])

    const onSuggestionsFetchRequested = ({ value }: { value: string }) => {
        if (lastRequestId !== null) {
            clearTimeout(lastRequestId)
        }
        const requestId = setTimeout(async () => {
            const suggestions = await filterProposalsAsync(proposals.proposalsAllPresetsForQuickSearch, value.trim())
            setSuggestions(suggestions)
        }, 500)
        setLastRequestId(requestId)
    }
    const onSuggestionsClearRequested = () => {
        setSuggestions([])
    }
    const inputProps = {
        placeholder: "Find nodes...",
        value: selection,
        onChange: (event: React.FormEvent<HTMLElement>, params: ChangeEvent) => {
            setSelection(params.newValue)
        },
    }
    const renderSuggestion = (s: UIProposal) => (
        <div>
            <SuggestionHeader>
                <Flag countryCode={s.country} />
                <span>{s.ipType}</span>
            </SuggestionHeader>
            <Small>{s.providerId}</Small>
        </div>
    )

    // Icons
    const closeAction = () => {
        setVisible(false)
    }
    const openAction = () => {
        proposals.prepareForQuickSearch()
        setVisible(true)
        setTimeout(() => {
            autosuggestRef?.current?.input?.focus()
        }, 50)
    }

    return (
        <>
            <IconContainer
                onClick={() => {
                    visible ? closeAction() : openAction()
                }}
            >
                <FontAwesomeIcon icon={visible ? faTimes : faSearch} />
            </IconContainer>
            {visible && (
                <>
                    <ProposalSearchContainer>
                        <Autosuggest
                            ref={autosuggestRef}
                            inputProps={inputProps}
                            suggestions={suggestions}
                            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                            onSuggestionsClearRequested={onSuggestionsClearRequested}
                            onSuggestionSelected={(evt, { suggestion }) => {
                                proposals.useQuickSearchSuggestion(suggestion)
                            }}
                            getSuggestionValue={(p: UIProposal) => p.providerId}
                            renderSuggestion={renderSuggestion}
                        />
                    </ProposalSearchContainer>
                </>
            )}
        </>
    )
})
