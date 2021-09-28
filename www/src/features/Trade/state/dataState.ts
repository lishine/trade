import { proxy, subscribe, useSnapshot } from 'valtio'
import { proxyWithComputed, derive } from 'valtio/utils'
import { calcExitPrice, calcLossPrice, symbols, TSymbols, TTick } from '~/features/Trade/localConstants'

export type TDataLevelsResidue = { left: TTick[][]; right: TTick[][] }

export type TSymbol = {
    tickSize: number
    quantityStepSize: number
}

export const dataState = proxy({
    symbols: {} as Record<string, TSymbol>,
    trades: {} as {
        [symbol: string]:
            | undefined
            | {
                  pastData: TTick[]
                  dataWs: TTick[]
                  slicedData: TTick[]
                  aggData: TTick[][]
                  dataLevelsResidue: TDataLevelsResidue
              }
    },
})

export const initSymbol = ({ symbol }: { symbol: string }) => {
    dataState.trades[symbol] = {
        pastData: [],
        dataWs: [],
        slicedData: [],
        aggData: [],
        dataLevelsResidue: { left: [], right: [] },
    }
}

export const getSecondsLoaded = ({ symbol }: { symbol: string }) => {
    let trades = dataState.trades[symbol]
    if (!trades) {
        return 0
    }
    let len = trades.aggData[0]?.length
    if (!len) {
        return 0
    }

    let endTimestamp = trades.aggData[0][len - 1].time
    let startTimestamp = trades.aggData[0][0].time
    return Math.round((endTimestamp - startTimestamp) / 1000)
}

export const getMinutesLoaded = ({ symbol }: { symbol: string }) => {
    return +(getSecondsLoaded({ symbol }) / 60).toFixed(1)
}

export const getHoursLoaded = ({ symbol }: { symbol: string }) => {
    return +(getMinutesLoaded({ symbol }) / 60).toFixed(1)
}

// const __derivedDataState = derive(
//     {
//         secondsLoaded: (get) => {
//             if (!get(dataState).aggData[0]?.length) {
//                 return 0
//             }
//             let endTimestamp = get(dataState).aggData[0][dataState.aggData[0].length - 1].time
//             let startTimestamp = get(dataState).aggData[0][0].time
//             return Math.round((endTimestamp - startTimestamp) / 1000)
//         },
//     },
//     { proxy: dataState }
// )

// const _derivedDataState = derive(
//     {
//         minutesLoaded: (get) => {
//             return +(get(__derivedDataState).secondsLoaded / 60).toFixed(1)
//         },
//     },
//     { proxy: __derivedDataState }
// )
// export const derivedDataState = derive(
//     {
//         hoursLoaded: (get) => {
//             return +(get(_derivedDataState).minutesLoaded / 60).toFixed(1)
//         },
//     },

//     { proxy: _derivedDataState }
// )
