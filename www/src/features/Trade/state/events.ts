import { _max_points_ } from '~/features/Trade/localConstants'
import { dataState } from '~/features/Trade/state/dataState'
import { state } from '~/features/Trade/state/state'

export const events = {
    onWheel: (deltaY: number) => {
        let trades = dataState.trades[state.symbol]
        if (!trades) {
            return
        }

        if (deltaY > 0) {
            let newLevel = state.zoomOutLevel - 1
            if (newLevel > 0) {
                state.zoomOutLevel = newLevel
            }
        } else {
            let newLevel = state.zoomOutLevel + 1
            if (
                newLevel < trades.aggData.length &&
                trades.aggData[newLevel] &&
                trades.aggData[newLevel].length >= _max_points_
            ) {
                state.zoomOutLevel = newLevel
            }
        }
        console.log(
            `onWheel state.zoomOutLevel ${state.zoomOutLevel}`,
            deltaY,
            trades.aggData.length,
            trades.aggData[0]?.length,
            trades.aggData[1]?.length
        )
    },
}

// if (deltaY > 0 && state.slicedDataLength > 200) {
//     state.slicedDataLength -= (deltaY * Math.round(Math.sqrt(state.slicedDataLength))) / 30
// }
// if (deltaY < 0 && state.slicedDataLength < dataState.data.length - 200) {
//     state.slicedDataLength -= (deltaY * Math.round(Math.sqrt(state.slicedDataLength))) / 30
// }
