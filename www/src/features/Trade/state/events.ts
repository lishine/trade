import { state, dataState } from '~/features/Trade/state/state'

export const events = {
    onWheel: (deltaY: number) => {
        if (deltaY > 0 && state.slicedDataLength > 200) {
            state.slicedDataLength -= deltaY
        }
        if (deltaY < 0 && state.slicedDataLength < dataState.data.length - 200) {
            state.slicedDataLength -= deltaY
        }
    },
}
