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
import { useStores } from "../../../store";

const Container = styled.div`
  cursor: pointer;
`;
export const MysteriumVPN2Toast: React.FC = () => {
  const root = useStores()
  const { config } = root
  useEffect(() => {
    if (config.vpn2Offered) {
      return
    }

    let link: string
    if (root.isWindows) {
      link = "https://www.mysteriumvpn.com/mysterium-vpn-v2?utm_source=MysteriumDark&utm_medium=Windows&utm_campaign=Banner"
    } else if (root.isMacOS) {
      link = "https://www.mysteriumvpn.com/mysterium-vpn-v2?utm_source=MysteriumDark&utm_medium=Mac&utm_campaign=Banner"
    } else {
      link = "https://www.mysteriumvpn.com/mysterium-vpn-v2?utm_source=MysteriumDark&utm_medium=Other&utm_campaign=Banner"
    }

    toast(dismissibleToast(
      <Container>
        <a onClick={() => {
          shell.openExternal(link);
          config.setVpn2Offered()
        }}>
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
