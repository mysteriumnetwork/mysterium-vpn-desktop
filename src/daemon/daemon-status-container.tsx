import React from "react";
import {View, Text} from "@nodegui/react-nodegui"
import {connect} from "react-redux";
import {State} from "../state";
import {DaemonStatusType} from "./state";

type StatusProps = {
    status: DaemonStatusType
}

const DaemonStatus: React.FC<StatusProps> = props => {
    const {status} = props
    const statusText = `Daemon status: ${status}`
    return (
        <View id="status">
            <Text id="statusText" style={textStyle}>{statusText}</Text>
        </View>
    )
}

const textStyle = `
flex: 1;
font-size: 30px;
width: 300px;
qproperty-alignment: 'AlignHCenter';
`


export default connect((state: State): StatusProps => ({
    status: state.daemon.status,
}))(DaemonStatus)
