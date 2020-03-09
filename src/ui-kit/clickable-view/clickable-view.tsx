import React, {ReactNode} from "react";
import {Button, View} from "@nodegui/react-nodegui";

export type ClickableViewProps = {
    width: number
    height: number
    children: ReactNode
    onClick: Function
}

export const ClickableView: React.FC<ClickableViewProps> = ({width, height, onClick, children}) => {
    return (
        <View
            id="container"
            style={`
                width: ${width};
                height: ${height};
                min-height: ${height};
            `}
        >
            <View
                id="content"
                style={`
                    width: ${width};
                    height: ${height};
                    min-height: ${height};
                `}
            >{children}</View>
            <Button
                id="ghost-button"
                on={{
                    "clicked": () => onClick()
                }}
                style={`
                    top: -${height};
                    width: ${width};
                    height: ${height};
                    min-height: ${height};
                    background: "transparent";
                `}
            />
        </View>
    )
}
