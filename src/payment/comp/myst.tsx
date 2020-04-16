/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"

import { brandDarker } from "../../ui-kit/colors"

export interface MystProps {
    light?: boolean
}

export const Myst: React.FC<MystProps> = ({ light }) => {
    const stroke = light ? "#fff" : brandDarker
    return (
        <svg width="21px" height="12px" viewBox="0 0 14 8" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <path
                    d="M1.14644661,4.43975328 L4.43975328,1.14644661 C4.63485389,0.951346001 4.95111736,0.951160972 5.14644613,1.14603316 L6.72226533,2.71816896 C6.76129874,2.75711113 6.8244877,2.75711113 6.86352111,2.71816896 L8.43934031,1.14603316 C8.63466907,0.951160972 8.95093255,0.951346001 9.14603316,1.14644661 L12.4393398,4.43975328 C12.634602,4.63501542 12.634602,4.95159791 12.4393398,5.14686006 L11.1464466,6.43975328 C10.9511845,6.63501542 10.634602,6.63501542 10.4393398,6.43975328 L8.8636039,4.86401735 C8.82455147,4.82496492 8.76123497,4.82496492 8.72218254,4.86401735 L7.14644661,6.43975328 C6.95118446,6.63501542 6.63460197,6.63501542 6.43933983,6.43975328 L4.8636039,4.86401735 C4.82455147,4.82496492 4.76123497,4.82496492 4.72218254,4.86401735 L3.14644661,6.43975328 C2.95118446,6.63501542 2.63460197,6.63501542 2.43933983,6.43975328 L1.14644661,5.14686006 C0.951184464,4.95159791 0.951184464,4.63501542 1.14644661,4.43975328 Z"
                    id="Path-7"
                    stroke={stroke}
                ></path>
                <line
                    x1="4.79289322"
                    y1="4.79330667"
                    x2="1.79289322"
                    y2="3.79330667"
                    id="Line-2"
                    stroke={stroke}
                    strokeLinecap="round"
                ></line>
                <line
                    x1="4.79289322"
                    y1="4.79330667"
                    x2="5.79289322"
                    y2="1.79330667"
                    id="Line-2"
                    stroke={stroke}
                    strokeLinecap="round"
                ></line>
                <line
                    x1="8.79289322"
                    y1="4.79330667"
                    x2="9.79289322"
                    y2="1.79330667"
                    id="Line-2"
                    stroke={stroke}
                    strokeLinecap="round"
                ></line>
                <line
                    x1="6.79289322"
                    y1="2.79330667"
                    x2="7.79289322"
                    y2="5.79330667"
                    id="Line-2"
                    stroke={stroke}
                    strokeLinecap="round"
                ></line>
            </g>
        </svg>
    )
}
