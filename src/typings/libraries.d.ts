/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
declare module "byte-size" {
    type ByteSize = {
        value: string
        unit: string
        long: string
        toString(): string
    }
    const byteSize: (
        bytes: number,
        options?: { precision?: number; units?: "metric" | "iec" | "metric_octet" | "iec_octet" },
    ) => ByteSize
    export default byteSize
}

declare module "@mysteriumnetwork/terms" {
    const TermsEndUser: string
}

// static assets /static
declare const __static: string

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Electron {
    export interface App {
        quitting?: boolean
    }
}

declare module "react-lottie-player" {
    import type { AnimationConfig, AnimationDirection, AnimationEventCallback, AnimationSegment } from "lottie-web"

    type LottieProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> &
        Pick<AnimationConfig, "loop" | "renderer" | "rendererSettings"> & {
            play?: boolean
            goTo?: number
            speed?: number
            direction?: AnimationDirection
            segments?: AnimationSegment | AnimationSegment[]
            // Replace with AnimationConfig definition after this is merged:
            // https://github.com/airbnb/lottie-web/pull/2547
            audioFactory?(assetPath: string): {
                play(): void
                seek(): void
                playing(): void
                rate(): void
                setVolume(): void
            }

            onComplete?: AnimationEventCallback
            onLoopComplete?: AnimationEventCallback
            onEnterFrame?: AnimationEventCallback
            onSegmentStart?: AnimationEventCallback
        } & ({ path?: string } | { animationData?: unknown })

    const Lottie: React.FC<LottieProps>

    export default Lottie
}
