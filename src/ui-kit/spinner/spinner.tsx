import React, {MutableRefObject, useCallback, useEffect, useRef} from "react";
import {Image, View} from "@nodegui/react-nodegui";
import {QLabel, QMovie} from "@nodegui/nodegui";
import {fixAssetPath} from "../../utils/paths";
import spinnerFile from "./spinner2.gif"
import logoFile from "./mnet1.png"
import {RNView} from "@nodegui/react-nodegui/dist/components/View/RNView";

const spinnerSize = {
    width: 200,
    height: 200,
}
const logoSize = {
    width: 178 / 2,
    height: 146 / 2,
}
const logoPos = {
    x: (spinnerSize.width - logoSize.width) / 2,
    y: (spinnerSize.height - logoSize.height) / 2,
}

const mov = new QMovie()
mov.setFileName(fixAssetPath(spinnerFile))

let ql: QLabel;

type SpinnerProps = {
    active: boolean
    top: number
    left: number
}

export const Spinner = ({active, top, left}: SpinnerProps) => {
    var viewRef: MutableRefObject<RNView | null> = useRef<RNView>(null);
    const setViewRef = useCallback((ref: RNView) => {
        viewRef.current = ref
        if (viewRef.current) {
            ql = new QLabel(viewRef.current);
            ql.setFixedSize(spinnerSize.width, spinnerSize.height)
            ql.lower()
            ql.setMovie(mov)
            ql.hide()
        }
    }, [])
    useEffect(() => {
        if (!viewRef) {
            return
        }
        if (active) {
            mov.start()
            ql.show()
        } else {
            mov.stop()
            ql.hide()
        }
    }, [active, viewRef])
    return (
        <View
            ref={setViewRef}
            id="container"
            pos={{
                x: left,
                y: top,
            }}
            style={`
                left: ${left};
                top: ${top};
                width: ${spinnerSize.width};
                height: ${spinnerSize.height};
            `}>
            <Image
                size={logoSize}
                maxSize={logoSize}
                pos={{
                    x: logoPos.x,
                    y: logoPos.y,
                }}
                style={`
                    width: ${logoSize.width};
                    height: ${logoSize.height};
                    left: ${logoPos.x};
                    top: ${logoPos.y};
                `}
                src={fixAssetPath(logoFile)}
            />
        </View>
    )
}
