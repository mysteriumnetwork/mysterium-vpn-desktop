/* eslint-disable */
/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useEffect } from "react";
import icon from "./icon.png";
import { toast } from "react-hot-toast";
import { dismissibleToast } from "../dismissibleToast";
import { shell } from "electron";
import styled from "styled-components";

const Container = styled.div`
  cursor: pointer;
`;
export const MysteriumVPN2Toast: React.FC = () => {
  useEffect(() => {
    toast(dismissibleToast(
      <Container>
        <a onClick={() => shell.openExternal("https://www.mysteriumvpn.com")}>
          <b>MysteriumVPN 2.0 for Desktop is available</b><br />
          <span>Download the new app to use Mysterium VPN on Android, iOS, Mac and Windows</span>
        </a>
      </Container>
    ), {
      duration: Infinity,
      icon: <img src={icon} width={64} height={64} />,
      style: {
        maxWidth: 400,
      }
    });
  });
  return <></>;
};
