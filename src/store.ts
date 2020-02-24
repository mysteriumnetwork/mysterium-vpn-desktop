import {DaemonStore} from "./daemon/store";
import {ConnectionStore} from "./connection/store";
import React from "react";

export const storesContext = React.createContext({
    daemon: new DaemonStore(),
    connection: new ConnectionStore(),
})

export const useStores = () => React.useContext(storesContext)
