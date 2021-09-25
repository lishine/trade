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

import { useEffect, useState } from 'react'
// {
//     /* <div
//                 draggable={true}
//                 style={{ userSelect: 'none' }}
//                 onDragEnter={(e) => console.log('move', e.movementY)}
//             >
//                 aaaaa
//             </div> */
// }

// const db = new Dexie('MyDatabase')

// // Declare tables, IDs and indexes
// db.version(1).stores({
//     friends: '++id, name, age',
// })

// const makeDb = async () => {
//     // @ts-ignore
//     await db.friends.add({
//         name: 'Camilla',
//         age: 25,
//         street: 'East 13:th Street',
//     })
// }
// makeDb()

// consider the direction of the array, where is the last, where is the most recent

// setRawData((rd) => {
//     return [...mappedTrades, ...rd]
// })

// useEffect(() => {
//     let idata = [...interpolatedData]
//     let maxN = 10
//     for (let n = 1; n <= maxN; n++) {
//         let continueN = true
//         idata[n] = [...idata[n]]
//         for (let index = idata[n].length; index < rawData.length / n; index++) {
//             let toavg: TTick[] = []
//             for (let a = 0; a < 2 ** n; a++) {
//                 let nextA = rawData[index * n + a]
//                 if (nextA !== undefined) {
//                     continueN = false
//                 }
//                 toavg.push(rawData[index * n + a])
//             }
//             if (!continueN) {
//                 break
//             }

//             let avgPrice =
//                 toavg.reduce((acc, v) => {
//                     return acc + v.price
//                 }, 0) / 2
//             let newTick = { ...toavg[0] }
//             newTick.price = avgPrice
//             idata[n].push(newTick)
//         }
//         if (!continueN) {
//             break
//         }
//     }
//     setInterpolatedData(idata)
// }, [rawData, interpolatedData])

// let {
//     mutate: placeOrder,
//     error: er,
//     isLoading: isMutationLoading,
// } = useMutation((vars: Record<string, any>) => wretch('/api/placeOrder').post(vars).json(), {
//     onError: er => {
//         console.log('er', er)
//     },
//     onSuccess: data => {
//         JSONstringify(data)
//     },
// })

// useEffect(() => {
// if (!isFirstMount) {
// console.log('er', er)
// }
// }, [isFirstMount, er])

// const { colorMode, toggleColorMode } = useColorMode()
// console.log('colorMode', colorMode)

{
    /* <Button
                        colorScheme='blue'
                        onClick={() => wretch('/api/placeOrder').post({ strategy: 'fromrest', sell: true })}
                    >
                        From Rest
                    </Button> */
}

// let last = _d[_d.length - 1]?.price ?? 0
// let beforelast = _d[_d.length - 2]?.price ?? 0
// let pprice = price
// if (roundDecimals(Math.abs(last - price), 2) <= 1 / 10 ** symbolData[symbol].decimals &&
//     roundDecimals(Math.abs(beforelast - last), 2) <= 1 / 10 ** symbolData[symbol].decimals &&
//     beforelast === price
// ) {
//     price = beforelast
// }
// // console.log(Math.abs(last - price), last, '=>', pprice, '=>', price, '|||', cnt++)

// setTimeout(() => {
//     clean()
// }, 10000)

// import { ApiHelloResult } from './api/__/types'

// import Binance from 'node-binance-api'
// export const binance = new Binance()
// binance.futuresAggTradeStream('LTCUSDT', (d: any) => console.log(d))

// import { USDMClient, WebsocketClient } from 'binance'
// import { newWsBinanceConnection } from '~/features/binanceWsClient'

// const client = new USDMClient()
// const wsClient = new WebsocketClient({ beautify: true })

// wsClient.subscribeAggregateTrades('LTCUSDT', 'coinm')
// wsClient.on('message', (data) => {
//     console.log('raw message received ', JSON.stringify(data, null, 2))
// })

// newWsBinanceConnection()

// client
//     .getExchangeInfo()
//     .then((result) => {
//         console.log('getExchangeInfo inverse result: ', result)
//     })
//     .catch((err) => {
//         console.error('getExchangeInfo inverse error: ', err)
//     })

// let { data } = useQuery<ApiHelloResult, string>(
//     'hello',
//     () => wretch('/api/getStatus').post({ symbol: symbol }).json(),
//     {
//         refetchInterval: 1000,
//     }
// )
// useEffect(() => {
//     setRefetchCnt(c => (c++ > 10 ? 1 : c))
//     if (!isFirstMount) {
//         let newLatest = data?.latest
//         setPrev(newLatest)
//         setLatest(newLatest)
//     }

// }, [data, isFirstMount])

// let promises: Promise<AggregatedTrade[]>[] = []
