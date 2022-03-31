/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Proposal, qualityLevel, QualityLevel } from "mysterium-vpn-js"

import { countryName } from "../location/countries"

export type ProposalKey = string

export interface UIProposal extends Proposal {
    key: ProposalKey
    country: string
    countryName: string
    shortId: string
    qualityLevel?: QualityLevel
    ipType: string
}

const shortId = (id: string): string => id.substring(0, 14)

export const newUIProposal = (proposal: Proposal): UIProposal => {
    return {
        ...proposal,
        qualityLevel: qualityLevel(proposal.quality),
        key: proposal.providerId,
        country: proposal.location.country ?? "unknown",
        countryName: countryName(proposal.location.country ?? "unknown"),
        ipType: proposal.location.ipType ?? "unknown",
        shortId: shortId(proposal.providerId),
    }
}

export const compareProposal = (a: UIProposal, b: UIProposal): number => (a.key > b.key ? 1 : -1)
