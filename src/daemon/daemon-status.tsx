import React, {useEffect} from "react";
import {Text, View} from "@nodegui/react-nodegui"
import {observer} from "mobx-react-lite";
import {useStores} from "../store";

export const DaemonStatus = observer(() => {
    const {daemon} = useStores();
    useEffect(() => {
        const timer = setInterval(async () => {
            await daemon.healthcheck()
        }, 1000);
        return () => clearInterval(timer);
    }, [])
    return (
        <View id="status" style={viewStyle}>
            <Text id="statusText" style={textStyle}>{`Daemon status: ${daemon.status}`}</Text>
        </View>
    )
})

const viewStyle = `
width: 500;
height: 45;
background: 'red';
`

const textStyle = `
qproperty-alignment: AlignCenter;
background: 'green';
font-size: 30px;
flex: 1;
`
