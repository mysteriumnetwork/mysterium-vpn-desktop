import { Proposal } from "mysterium-vpn-js"

export interface UIProposal extends Proposal {
    key: string
    country?: string
    id10: string
    serviceType4: string
}

const id10 = (id: string): string => id.substr(0, 10)

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
    const key = `${proposal.providerId}${proposal.serviceType}`
    return {
        ...proposal,
        key,
        country: proposal.serviceDefinition?.locationOriginate?.country,
        id10: id10(proposal.providerId),
        serviceType4: serviceType4(proposal.serviceType),
    }
}

export const compareProposal = (a: UIProposal, b: UIProposal): number => a.key.localeCompare(b.key)
