import React, {useEffect} from "react";
import {observer} from "mobx-react-lite";
import {useStores} from "../store";

export const DaemonStatus = observer(() => {
    const {daemon} = useStores();
    useEffect(() => {
        const timer = setInterval(async () => {
            await daemon.healthcheck()
        }, 200);
        return () => clearInterval(timer);
    }, [])
    return (<></>)
})
