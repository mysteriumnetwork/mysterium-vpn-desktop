import React, { useState } from "react"
import { Button, View } from "@nodegui/react-nodegui"
import { ClickableView } from "../clickable-view/clickable-view"

export type ListGroupProps = {
    initiallyCollapsed: boolean
    header: React.ReactNode
    content: React.ReactNode
}

const styleSheet = `
#container {
    width: "100%";
}
#header {
    background: #7f8c8d;
    width: "100%";
    justify-content: "space-between";
}
#header-left {
    width: "70%";
}
#header-right {
    justify-content: "flex-end";
    width: "20%";
}
#collapse {
    top: -5;
    width: 15;
    background: "transparent";
    color: "white";
}
`

export const Collapse: React.FC<ListGroupProps> = ({ initiallyCollapsed, header, content }) => {
    const [collapsed, setCollapsed] = useState(initiallyCollapsed)
    const collapseText = collapsed ? "▼" : "▲"
    return (
        <View id="container" styleSheet={styleSheet}>
            <View id="header">
                <ClickableView width={320} height={40} onClick={(): void => setCollapsed(!collapsed)}>
                    <View id="header-left">{header}</View>
                    <View id="header-right">
                        <Button
                            id="collapse"
                            text={collapseText}
                            on={{
                                clicked: (): void => {
                                    setCollapsed(() => !collapsed)
                                },
                            }}
                        />
                    </View>
                </ClickableView>
            </View>
            {!collapsed && <View>{content}</View>}
        </View>
    )
}
