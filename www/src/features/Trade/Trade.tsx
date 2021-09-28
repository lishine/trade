import { useHandler } from 'react-handler-hooks'
import { useRef, useEffect, useState } from 'react'
import { useLatest, useFirstMountState, useMountedState, useInterval } from 'react-use'
import { sleep, runAndSubscribeFew, runAndSubscribeKey } from '~/utils'
import { RefLabel } from '~/features/Trade/components/RefLabel'
import { UI } from '~/features/Trade/components/UI'
import { derivedState, state } from '~/features/Trade/state/state'
import { loadData, wsSubscribeCurrentPrice } from '~/features/Trade/state/dataActions'

import { Chart } from '~/features/Trade/components/Chart'
import { ChartReactVis } from '~/features/Trade/components/ChartReactVis'
import { bClient, createTick } from '~/features/Trade/utils'
import { subscribe } from 'valtio'
import { subscribeKey } from 'valtio/utils'
import { dataState, initSymbol } from '~/features/Trade/state/dataState'
import { doAggData } from '~/features/Trade/state/aggUtils'
import { getExchangeInfo } from '~/features/Trade/state/exchangeInfo'

// let time = new Date().getTime()

// const fetchFn = async (i: number) => {
//     // await sleep(i * 300)
//     await bClient.futuresAggTrades({
//         symbol: 'LTCUSDT',
//         endTime: time,
//         limit: 1000,
//     })
//     time -= 500000
// }

// const fnAll = async () => {
//     let promises = new Array(1).fill(undefined).map((t, i) => {
//         return fetchFn(i)
//     })
//     await Promise.all(promises)
// }

export const Trade = ({ isReactVis }: { isReactVis?: boolean }) => {
    useEffect(() => {
        const fn = async () => {
            let a = await getExchangeInfo()
        }
        fn()
    }, [])
    // useEffect(() => {
    //     const fn = async () => {
    //         for (let index = 0; index < 133; index++) {
    //             console.log('index', index)
    //             await fnAll()
    //         }
    //     }
    //     fn()
    // }, [])

    const subs = useRef<any[]>()

    useEffect(
        () =>
            runAndSubscribeKey(state, 'symbol', () => {
                if (!state.symbol) {
                    return
                }
                subs.current?.forEach((s) => s?.())
                subs.current = subs.current || []

                initSymbol({ symbol: state.symbol })
                let trades = dataState.trades[state.symbol]
                console.log('trades', trades)
                if (!trades) {
                    return
                }

                subs.current.push(wsSubscribeCurrentPrice())
                loadData()

                subs.current.push(
                    subscribe(trades.pastData, () => {
                        if (!trades) {
                            return
                        }

                        doAggData({
                            isPrepend: true,
                            addData: trades.pastData,
                            aggData: trades.aggData,
                            dataLevelsResidue: trades.dataLevelsResidue,
                        })

                        console.log('3')
                    })
                )

                subs.current.push(
                    subscribe(trades.dataWs, () => {
                        if (!trades) {
                            return
                        }
                        doAggData({
                            isPrepend: false,
                            addData: trades.dataWs,
                            aggData: trades.aggData,
                            dataLevelsResidue: trades.dataLevelsResidue,
                        })
                        trades.dataWs.length = 0
                    })
                )
            }),
        []
    )

    return (
        <div>
            <UI />
            {isReactVis ? <ChartReactVis /> : <Chart />}
        </div>
    )
}
