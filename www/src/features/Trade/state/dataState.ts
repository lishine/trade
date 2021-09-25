import { proxy, subscribe, useSnapshot } from 'valtio'
import { proxyWithComputed, derive } from 'valtio/utils'
import { calcExitPrice, calcLossPrice, symbols, TSymbols, TTick } from '~/features/Trade/localConstants'

export type TDataLevelsResidue = { left: TTick[][]; right: TTick[][] }

export const dataState = proxy({
    data: [] as TTick[],
    dataWs: [] as TTick[],
    dataDirect: [] as TTick[],
    dataAvg: [] as TTick[][],
    slicedData: [] as TTick[],
    aggData: [] as TTick[][],
    dataLevelsResidue: { left: [], right: [] } as TDataLevelsResidue,
})

const __derivedDataState = derive(
    {
        secondsLoaded: (get) => {
            if (!get(dataState).aggData[0]?.length) {
                return 0
            }
            let endTimestamp = get(dataState).aggData[0][dataState.aggData[0].length - 1].time
            let startTimestamp = get(dataState).aggData[0][0].time
            return Math.round((endTimestamp - startTimestamp) / 1000)
        },
    },
    { proxy: dataState }
)

const _derivedDataState = derive(
    {
        minutesLoaded: (get) => {
            return +(get(__derivedDataState).secondsLoaded / 60).toFixed(1)
        },
    },
    { proxy: __derivedDataState }
)
export const derivedDataState = derive(
    {
        hoursLoaded: (get) => {
            return +(get(_derivedDataState).minutesLoaded / 60).toFixed(1)
        },
    },

    { proxy: _derivedDataState }
)
