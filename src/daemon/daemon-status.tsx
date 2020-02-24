import React from "react";
import {Text, View} from "@nodegui/react-nodegui"
import {useSelector} from "react-redux";

export const DaemonStatus = () => {
    const status = useSelector(state => state.daemon.status)
    return (
        <View id="status" style={viewStyle}>
            <Text id="statusText" style={textStyle}>{`Daemon status: ${status}`}</Text>
        </View>
    )
}

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
