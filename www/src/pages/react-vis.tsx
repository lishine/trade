// import type { NextPage } from 'next'
// import Head from 'next/head'
// import { useMutation, useQuery } from 'react-query'
// import styles from '../styles/home.module.scss'
import wretch from 'wretch'
// import { useEffect, useState } from 'react'
// import { useLatest, useFirstMountState, useMountedState } from 'react-use'
// import { useHandler } from 'react-handler-hooks'
// import {
//     Input,
//     HStack,
//     VStack,
//     FormLabel,
//     Select,
//     FormControl,
//     Button,
//     ButtonGroup,
//     useColorMode,
// } from '@chakra-ui/react'
// // import { LineChart, Line, CartesianGrid, XAxis, YAxis, ReferenceLine } from 'recharts'
// import dayjs from 'dayjs'
// import Dexie from 'dexie'
// import { useLiveQuery } from 'dexie-react-hooks'
// import {
//     VerticalGridLines,
//     XYPlot,
//     XAxis,
//     YAxis,
//     HorizontalGridLines,
//     LineSeries,
//     LineSeriesCanvas,
//     LineMarkSeries,
//     MarkSeries,
//     LineMarkSeriesCanvas,
// } from 'react-vis'

// import Binance, { ReconnectingWebSocketHandler, AggregatedTrade } from 'binance-api-node'
// import { sleep } from '~/utils'

// const bClient = Binance()

// let cnt = 0

// const createTick = ({ trade }: { trade: AggregatedTrade }) => {
//     let timestamp = +trade.timestamp

//     let price = +trade.price
//     return { timestamp: timestamp, x: timestamp, y: price } as TTick
// }

// const Home: NextPage = () => {
//     const isFirstMount = useFirstMountState()

//     const [refetchCnt, setRefetchCnt] = useState(0)
//     const [prev, setPrev] = useState(0)
//     const [latest, setLatest] = useState(0)

//     const [symbol, setSymbol] = useState<TSymbols>('BALUSDT')
//     const [quantity, setQuantity] = useState(0.001)
//     const [stopLossPips, setStopLossPips] = useState(20)
//     const [takeProfitLimitPips, setTakeProfitLimitPips] = useState(10)

//     const [data, setData] = useState<TTick[]>([])
//     const [interpolatedData, setInterpolatedData] = useState<TTick[][]>([[]])
//     const [rawData, setRawData] = useState<TTick[]>([])
//     let refData = useLatest(data)

//     const [loaded, setLoaded] = useState(false)

//     useEffect(() => {
//         let clean: ReconnectingWebSocketHandler | undefined

//         setLoaded(false)
//         setData([])
//         clean = bClient.ws.futuresAggTrades([symbol], (trade) => {
//             setData((_d) => {
//                 let d = createTick({ trade })
//                 let nd = [..._d, d]
//                 if (nd[nd.length - 1].timestamp - nd[0].timestamp > 600000) {
//                     nd.shift()
//                 }
//                 return nd
//             })
//         })

//         return () => {
//             clean?.()
//         }
//     }, [symbol])

//     useEffect(() => {
//         if (!loaded && data.length) {
//             setLoaded(true)
//             let fn = async () => {
//                 for (let index = 0; index < 100; index++) {
//                     let aggTrades: AggregatedTrade[] = []
//                     aggTrades = await bClient.futuresAggTrades({
//                         symbol: symbol,
//                         endTime: refData.current[0].timestamp - 1,
//                         limit: 500,
//                     })
//                     let mappedTrades = aggTrades.map((t) => createTick({ trade: t }))

//                     // setRawData((rd) => {
//                     //     return [...mappedTrades, ...rd]
//                     // })
//                     setData((d) => {
//                         return [...mappedTrades, ...d]
//                     })

//                     let startTimestamp = mappedTrades[0].timestamp
//                     let endTimestamp = refData.current[refData.current.length - 1].timestamp
//                     if ((endTimestamp - startTimestamp) / 6000 > 5) {
//                         break
//                     }
//                     await sleep(10)
//                 }
//                 setSliceLength(refData.current.length)
//                 // setTimeout(() => {
//                 //     setData((d) => d.slice(500))
//                 // }, 5000)
//             }
//             fn()
//         }
//     }, [symbol, loaded, data, refData])

//     // consider the direction of the array, where is the last, where is the most recent

//     // useEffect(() => {
//     //     let idata = [...interpolatedData]
//     //     let maxN = 10
//     //     for (let n = 1; n <= maxN; n++) {
//     //         let continueN = true
//     //         idata[n] = [...idata[n]]
//     //         for (let index = idata[n].length; index < rawData.length / n; index++) {
//     //             let toavg: TTick[] = []
//     //             for (let a = 0; a < 2 ** n; a++) {
//     //                 let nextA = rawData[index * n + a]
//     //                 if (nextA !== undefined) {
//     //                     continueN = false
//     //                 }
//     //                 toavg.push(rawData[index * n + a])
//     //             }
//     //             if (!continueN) {
//     //                 break
//     //             }

//     //             let avgPrice =
//     //                 toavg.reduce((acc, v) => {
//     //                     return acc + v.price
//     //                 }, 0) / 2
//     //             let newTick = { ...toavg[0] }
//     //             newTick.price = avgPrice
//     //             idata[n].push(newTick)
//     //         }
//     //         if (!continueN) {
//     //             break
//     //         }
//     //     }
//     //     setInterpolatedData(idata)
//     // }, [rawData, interpolatedData])

//     const [sliceLength, setSliceLength] = useState(1000)
//     const [slicedData, setSlicedData] = useState(data)

//     useEffect(() => {
//         // console.log('sliceLength', sliceLength, data.length, data.slice(sliceLength * -1).length)
//         if (sliceLength < data.length) {
//             if (sliceLength < 20) {
//                 setSlicedData(data)
//             }
//             setSlicedData(data.slice(sliceLength * -1))
//         } else {
//             setSlicedData(data)
//         }
//     }, [sliceLength, data])

//     // console.log('slicedData', slicedData)
//     const Line = LineMarkSeries

//     // console.log('data.slice(0, 20)', data.slice(0, 20))

//     // console.log(
//     // 'slicedData',
//     // slicedData.map((t) => t.timestamp)
//     // )

//     console.log(
//         'data',
//         data.length,
//         data.map((d) => d.timestamp)
//     )

//     return (
//         <div className={styles.container}>
//             {/* <div
//                 draggable={true}
//                 style={{ userSelect: 'none' }}
//                 onDragEnter={(e) => console.log('move', e.movementY)}
//             >
//                 aaaaa
//             </div> */}
//             <div
//                 onWheel={(w) => {
//                     setSliceLength((sl) => {
//                         if (w.deltaY > 0 && sl > 200) {
//                             return sl - (w.deltaY * Math.round(Math.sqrt(sl))) / 30
//                         }
//                         if (w.deltaY < 0 && sl < refData.current.length - 200) {
//                             return sl - (w.deltaY * Math.round(Math.sqrt(sl))) / 30
//                         }
//                         return sl
//                     })
//                 }}
//             >
//                 <XYPlot width={1000} height={1000}>
//                     {/* <HorizontalGridLines /> */}
//                     {/* <VerticalGridLines /> */}
//                     <Line
//                         data={data}
//                         // curve='curveLinear'
//                     />
//                     <XAxis
//                         // tickTotal={10}
//                         tickFormat={(v) => {
//                             let t = dayjs(v).format('HH-mm-ss-sss')
//                             console.log('t', t)
//                             return t
//                         }}
//                     />
//                     <YAxis tickTotal={10} width={70} />
//                 </XYPlot>
//                 {/* <LineChart width={1900} height={1000} data={slicedData}>
//                     <ReferenceLine y={179.38} label={<RefLabel />} stroke='red' strokeDasharray='3 3' />
//                     <Line
//                         isAnimationActive={false}
//                         type='monotone'
//                         dataKey='price'
//                         stroke='#2A62FF'
//                         strokeWidth={2}
//                         dot={false}
//                         // dot={{ stroke: 'grey', strokeWidth: 1 }}
//                     />
//                     <XAxis
//                         dataKey='time'
//                         // tickCount={100}
//                         minTickGap={100}
//                     />
//                     <YAxis
//                         tickCount={10}
//                         type='number'
//                         domain={['dataMin', 'dataMax']}
//                         padding={{
//                             top: 20,
//                             bottom: 20,
//                         }}
//                     />
//                 </LineChart> */}
//             </div>

//             {/* {typeof window !== 'undefined' && <StockChartExported />} */}
//             {false && (
//                 <main className={styles.main}>
//                     <VStack spacing={100}>
//                         <ButtonGroup variant='solid' size='lg' spacing='20'>
//                             <Button
//                                 colorScheme='darkred'
//                                 onClick={async () => {
//                                     let data = await wretch('/api/getStatus').post().json()
//                                 }}
//                             >
//                                 Get Status
//                             </Button>
//                         </ButtonGroup>
//                         <ButtonGroup variant='solid' size='lg' spacing='20'>
//                             <Button
//                                 colorScheme='darkgreen'
//                                 onClick={async () => {
//                                     let data = await wretch('/api/testStartLimit')
//                                         .post({
//                                             isLong: true,
//                                             symbol: symbol,
//                                             decimals: symbolData[symbol].decimals,
//                                             quantity: quantity,
//                                         })
//                                         .json()
//                                     console.table(data)
//                                 }}
//                             >
//                                 Long - test start limit
//                             </Button>
//                             <Button
//                                 colorScheme='darkred'
//                                 onClick={async () => {
//                                     let data = await wretch('/api/testStartLimit')
//                                         .post({
//                                             isLong: false,
//                                             symbol: symbol,
//                                             decimals: symbolData[symbol].decimals,
//                                             quantity: quantity,
//                                         })
//                                         .json()
//                                     console.table(data)
//                                 }}
//                             >
//                                 Short - test start limit
//                             </Button>
//                         </ButtonGroup>
//                         <ButtonGroup variant='solid' size='lg' spacing='20'>
//                             <Button
//                                 colorScheme='darkgreen'
//                                 onClick={() =>
//                                     wretch('/api/simple').post({
//                                         isLong: true,
//                                         symbol: symbol,
//                                         decimals: symbolData[symbol].decimals,
//                                         quantity: quantity,
//                                         stopLossPips: stopLossPips,
//                                         takeProfitLimitPips: takeProfitLimitPips,
//                                     })
//                                 }
//                             >
//                                 Long
//                             </Button>
//                             <Button
//                                 colorScheme='darkred'
//                                 onClick={() =>
//                                     wretch('/api/simple').post({
//                                         isLong: false,
//                                         symbol: symbol,
//                                         decimals: symbolData[symbol].decimals,
//                                         quantity: quantity,
//                                         stopLossPips: stopLossPips,
//                                         takeProfitLimitPips: takeProfitLimitPips,
//                                     })
//                                 }
//                             >
//                                 Short
//                             </Button>
//                         </ButtonGroup>
//                         <HStack>
//                             <FormControl id='form1'>
//                                 <FormLabel>Symbol</FormLabel>
//                                 <Select
//                                     defaultValue={symbol}
//                                     placeholder='Select symbol'
//                                     onChange={(e) => {
//                                         setSymbol(e.target.value as TSymbols)
//                                     }}
//                                 >
//                                     <option>BTCUSDT</option>
//                                     <option>SOLUSDT</option>
//                                     <option>XRPUSDT</option>
//                                     <option>LTCUSDT</option>
//                                 </Select>
//                             </FormControl>
//                             <FormControl id='form2'>
//                                 <FormLabel>Quantity</FormLabel>
//                                 <Input
//                                     type='text'
//                                     defaultValue={quantity}
//                                     onChange={(e) => {
//                                         setQuantity(+e.target.value)
//                                     }}
//                                 />
//                             </FormControl>
//                             <FormControl id='form3'>
//                                 <FormLabel>Stop Loss (pips)</FormLabel>
//                                 <Input
//                                     value={stopLossPips}
//                                     onChange={(e) => {
//                                         setStopLossPips(+e.target.value)
//                                     }}
//                                 />
//                             </FormControl>
//                         </HStack>
//                     </VStack>
//                 </main>
//             )}

//             {false && (
//                 <footer className={styles.footer}>
//                     <div>
//                         <div>{new Array(refetchCnt).fill('*').join('')}</div>
//                         {latest && (
//                             <div>
//                                 latest: {latest}
//                                 {prev && <span> {latest > prev ? ' UP' : ' DOWN'}</span>}
//                             </div>
//                         )}
//                     </div>
//                 </footer>
//             )}
//         </div>
//     )
// }

// // let {
// //     mutate: placeOrder,
// //     error: er,
// //     isLoading: isMutationLoading,
// // } = useMutation((vars: Record<string, any>) => wretch('/api/placeOrder').post(vars).json(), {
// //     onError: er => {
// //         console.log('er', er)
// //     },
// //     onSuccess: data => {
// //         JSONstringify(data)
// //     },
// // })
// export default Home

// // useEffect(() => {
// // if (!isFirstMount) {
// // console.log('er', er)
// // }
// // }, [isFirstMount, er])

// // const { colorMode, toggleColorMode } = useColorMode()
// // console.log('colorMode', colorMode)

// {
//     /* <Button
//                         colorScheme='blue'
//                         onClick={() => wretch('/api/placeOrder').post({ strategy: 'fromrest', sell: true })}
//                     >
//                         From Rest
//                     </Button> */
// }

// // let last = _d[_d.length - 1]?.price ?? 0
// // let beforelast = _d[_d.length - 2]?.price ?? 0
// // let pprice = price
// // if (roundDecimals(Math.abs(last - price), 2) <= 1 / 10 ** symbolData[symbol].decimals &&
// //     roundDecimals(Math.abs(beforelast - last), 2) <= 1 / 10 ** symbolData[symbol].decimals &&
// //     beforelast === price
// // ) {
// //     price = beforelast
// // }
// // // console.log(Math.abs(last - price), last, '=>', pprice, '=>', price, '|||', cnt++)

// // setTimeout(() => {
// //     clean()
// // }, 10000)

// // import { ApiHelloResult } from './api/__/types'

// // import Binance from 'node-binance-api'
// // export const binance = new Binance()
// // binance.futuresAggTradeStream('LTCUSDT', (d: any) => console.log(d))

// // import { USDMClient, WebsocketClient } from 'binance'
// // import { newWsBinanceConnection } from '~/features/binanceWsClient'

// // const client = new USDMClient()
// // const wsClient = new WebsocketClient({ beautify: true })

// // wsClient.subscribeAggregateTrades('LTCUSDT', 'coinm')
// // wsClient.on('message', (data) => {
// //     console.log('raw message received ', JSON.stringify(data, null, 2))
// // })

// // newWsBinanceConnection()

// // client
// //     .getExchangeInfo()
// //     .then((result) => {
// //         console.log('getExchangeInfo inverse result: ', result)
// //     })
// //     .catch((err) => {
// //         console.error('getExchangeInfo inverse error: ', err)
// //     })

// // let { data } = useQuery<ApiHelloResult, string>(
// //     'hello',
// //     () => wretch('/api/getStatus').post({ symbol: symbol }).json(),
// //     {
// //         refetchInterval: 1000,
// //     }
// // )
// // useEffect(() => {
// //     setRefetchCnt(c => (c++ > 10 ? 1 : c))
// //     if (!isFirstMount) {
// //         let newLatest = data?.latest
// //         setPrev(newLatest)
// //         setLatest(newLatest)
// //     }

// // }, [data, isFirstMount])

// // let promises: Promise<AggregatedTrade[]>[] = []
