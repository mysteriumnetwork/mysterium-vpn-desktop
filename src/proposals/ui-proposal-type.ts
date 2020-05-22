/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Proposal, QualityLevel } from "mysterium-vpn-js"

export type ProposalKey = string

export const proposalKey = ({ providerId, serviceType }: { providerId: string; serviceType: string }): ProposalKey => {
    return providerId + serviceType
}

export interface UIProposal extends Proposal {
    key: ProposalKey
    country?: string
    shortId: string
    serviceType4: string
    qualityLevel?: QualityLevel
    nodeType: string
}

const shortId = (id: string): string => id.substr(0, 16)

const serviceType4 = (serviceType: string): string => {
    switch (serviceType) {
        case "openvpn": {
            return "ovpn"
        }
        case "wireguard": {
            return "wgrd"
        }
    }
    return serviceType.substr(0, 4)
}

export const newUIProposal = (proposal: Proposal): UIProposal => {
    return {
        ...proposal,
        key: proposalKey(proposal),
        country: proposal.serviceDefinition?.locationOriginate?.country ?? "unknown",
        nodeType: proposal.serviceDefinition?.locationOriginate?.nodeType ?? "unknown",
        shortId: shortId(proposal.providerId),
        serviceType4: serviceType4(proposal.serviceType),
        qualityLevel: QualityLevel.UNKNOWN,
    }
}

export const compareProposal = (a: UIProposal, b: UIProposal): number => a.key.localeCompare(b.key)
