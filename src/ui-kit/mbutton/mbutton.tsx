import React from "react"
import { Button } from "@nodegui/react-nodegui"
import { brand } from "../colors"

export type MButtonProps = {
    text: string
    onClick: () => void
}

export const MButton: React.FC<MButtonProps> = ({ text, onClick }) => {
    return (
        <Button
            style={`
                padding: 10;
                font-size: 14px; 
                font-weight: bold; 
                background: ${brand}; 
                color: #fff; 
                border-radius: 3;
            `}
            text={text}
            on={{
                clicked: (): void => onClick(),
            }}
        />
    )
}
