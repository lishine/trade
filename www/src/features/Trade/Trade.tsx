import { useHandler } from 'react-handler-hooks'
import { useEffect, useState } from 'react'
import { useLatest, useFirstMountState, useMountedState, useInterval } from 'react-use'
import { sleep, runAndSubscribeFew, runAndSubscribeKey } from '~/utils'
import { RefLabel } from '~/features/Trade/components/RefLabel'
import { UI } from '~/features/Trade/components/UI'
import { derivedState, state } from '~/features/Trade/state/state'
import {
    aggData,
    getExchangeInfo,
    loadData,
    wsSubscribeCurrentPrice,
} from '~/features/Trade/state/dataActions'
import { dataState } from '~/features/Trade/state/state'

import { Chart } from '~/features/Trade/components/Chart'
import { ChartReactVis } from '~/features/Trade/components/ChartReactVis'
import { bClient, createTick } from '~/features/Trade/utils'
import { subscribe } from 'valtio'

export const Trade = ({ isReactVis }: { isReactVis?: boolean }) => {
    // useEffect(() => {
    // getExchangeInfo()
    // }, [])

    // useEffect(
    //     () =>
    //         runAndSubscribeKey(state, 'symbol', () => {
    //             dataState.data = []
    //             wsSubscribeCurrentPrice()
    //             loadData()
    //         }),
    //     []
    // )

    // useEffect(
    //     () =>
    //         subscribe(dataState.data, () => {
    //             aggData({ isPrepend: true, dataKey: 'data' })
    //         }),
    //     []
    // )
    // useEffect(
    //     () =>
    //         subscribe(dataState.dataWs, () => {
    //             aggData({ isPrepend: false, dataKey: 'dataWs' })
    //         }),
    //     []
    // )

    // useEffect(
    //     () =>
    //         runAndSubscribeFew([[state, 'slicedDataLength'], [dataState.data]], () => {
    //             if (state.slicedDataLength > 20) {
    //                 dataState.slicedData = dataState.data.slice(state.slicedDataLength * -1)
    //             }
    //         }),
    //     []
    // )
    // useInterval(() => {
    //     const fn = async () => {
    //         let dagg = await bClient.futuresAggTrades({ symbol: 'LTCUSDT', limit: 400 })
    //         let ddirect = await bClient.futuresTrades({ symbol: 'LTCUSDT', limit: 400 })
    //         // console.log('d.length', d.length, new Date(d[d.length - 1].time))
    //         dataState.data = dagg
    //             .map((_d) => createTick({ trade: { price: _d.price, timestamp: _d.timestamp } }))
    //             .filter((d) => d.timestamp > new Date().getTime() - 60000)

    //         dataState.dataDirect = ddirect
    //             .map((_d) => createTick({ trade: { price: _d.price, timestamp: _d.time } }))
    //             .filter(
    //                 (d) =>
    //                     d.timestamp >= (dataState.data[dataState.data.length - 1]?.timestamp ?? 0) - 60000 &&
    //                     d.timestamp <= (dataState.data[dataState.data.length - 1]?.timestamp ?? 0)
    //             )
    //     }
    //     fn()
    // }, 2000)

    return (
        <div>
            <UI />
            {isReactVis ? <ChartReactVis /> : <Chart />}
        </div>
    )
}
