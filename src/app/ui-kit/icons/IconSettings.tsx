/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"

import { IconProps } from "./Props"

export const IconSettings: React.FC<IconProps> = ({ color }) => (
    <svg height="20" viewBox="0 0 19 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M9.5 22L0 16.5V5.5L9.5 0L19 5.5V16.5L9.5 22ZM9.5 2.312L2 6.653V15.347L9.5 19.689L17 15.347V6.653L9.5 2.311V2.312ZM9.5 15C8.43948 14.997 7.42294 14.5759 6.671 13.828C5.52724 12.6839 5.18525 10.9635 5.80448 9.46892C6.42371 7.97436 7.88223 7 9.5 7C10.5603 7.00284 11.5765 7.42402 12.328 8.172C13.8895 9.734 13.8895 12.266 12.328 13.828C11.5764 14.5757 10.5602 14.9968 9.5 15ZM9.5 9C8.54584 8.9998 7.72441 9.67364 7.53808 10.6094C7.35175 11.5452 7.85241 12.4823 8.73387 12.8476C9.61533 13.2129 10.6321 12.9047 11.1623 12.1114C11.6926 11.3182 11.5886 10.2608 10.914 9.586C10.5398 9.20978 10.0307 8.99879 9.5 9Z"
            fill={color}
        />
    </svg>
)
