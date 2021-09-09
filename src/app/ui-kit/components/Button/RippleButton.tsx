/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import styled from "styled-components"

import { brand } from "../../colors"

export const RippleButton = styled.button`
    position: relative;
    display: inline-block;
    box-sizing: border-box;
    border: none;
    border-radius: 5px;
    padding: 0 16px;
    min-width: 64px;
    height: 36px;
    line-height: 36px;
    vertical-align: middle;
    text-align: center;
    text-overflow: ellipsis;
    color: #fff;
    background-color: ${brand};
    overflow: hidden;
    cursor: pointer;
    &:before {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: #fff;
        opacity: 0;
        transition: opacity 0.2s;
    }
    &:after {
        content: "";
        position: absolute;
        left: 50%;
        top: 50%;
        border-radius: 50%;
        padding: 50%;
        background-color: #fff;
        opacity: 0;
        transform: translate(-50%, -50%) scale(1);
        transition: opacity 1s, transform 0.5s;
    }

    &:hover:before {
        opacity: 0.08;
    }
    &:focus:before {
        opacity: 0.24;
    }
    &:hover:focus:before {
        opacity: 0.3;
    }
    &:active:after {
        opacity: 0.32;
        transform: translate(-50%, -50%) scale(0);
        transition: transform 0s;
    }

    &:disabled {
        color: #777;
        background-color: #ccc;
        box-shadow: none;
        cursor: initial;
    }
    &:disabled:before,
    &:disabled:after {
        opacity: 0;
    }
`
