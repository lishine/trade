import type { NextPage } from 'next'
import Head from 'next/head'
import { useMutation, useQuery } from 'react-query'
import styles from '../styles/home.module.scss'
// import wretch from 'wretch'
import { useEffect, useState } from 'react'
import { useLatest, useFirstMountState, useMountedState } from 'react-use'
import { useHandler } from 'react-handler-hooks'
import {
    Input,
    HStack,
    VStack,
    FormLabel,
    Select,
    FormControl,
    Button,
    ButtonGroup,
    useColorMode,
} from '@chakra-ui/react'
// import { LineChart, Line, CartesianGrid, XAxis, YAxis, ReferenceLine } from 'recharts'
import dayjs from 'dayjs'
import Dexie from 'dexie'
import { useLiveQuery } from 'dexie-react-hooks'
import {
    VerticalGridLines,
    XYPlot,
    XAxis,
    YAxis,
    HorizontalGridLines,
    LineSeries,
    LineSeriesCanvas,
    LineMarkSeries,
    MarkSeries,
    LineMarkSeriesCanvas,
} from 'react-vis'

import Binance, { ReconnectingWebSocketHandler, AggregatedTrade } from 'binance-api-node'
import { sleep } from '~/utils'
import { bClient } from '~/features/Trade/utils'
import wretch from 'wretch'
import { Trade } from '~/features/Trade/Trade'

const bClie7nt = Binance()

let cnt = 0

type TTick = {
    x: number
    y: number
}

const createTick = ({ trade }: { trade: AggregatedTrade }) => {
    let timestamp = +trade.timestamp

    let price = +trade.price
    return { x: timestamp, y: price } as TTick
}

let symbols = {
    BTCUSDT: {
        decimals: 0,
    },
    SOLUSDT: {
        decimals: 3,
    },
    XRPUSDT: {
        decimals: 4,
    },
    LTCUSDT: {
        decimals: 2,
    },
    SCUSDT: {
        decimals: 5,
    },
    BALUSDT: {
        decimals: 2,
    },
    DGBUSDT: {
        decimals: 5,
    },
}
type TSymbols = keyof typeof symbols

cnt = 0

const Home: NextPage = () => {
    const isFirstMount = useFirstMountState()

    const [refetchCnt, setRefetchCnt] = useState(0)
    const [prev, setPrev] = useState(0)
    const [latest, setLatest] = useState(0)

    const [symbol, setSymbol] = useState<TSymbols>('BALUSDT')
    const [quantity, setQuantity] = useState(0.001)
    const [stopLossPips, setStopLossPips] = useState(20)
    const [takeProfitLimitPips, setTakeProfitLimitPips] = useState(10)

    let [data, setData] = useState<TTick[]>([])
    const [interpolatedData, setInterpolatedData] = useState<TTick[][]>([[]])
    const [rawData, setRawData] = useState<TTick[]>([])
    let refData = useLatest(data)

    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        let clean: ReconnectingWebSocketHandler | undefined

        setLoaded(false)
        setData([])
        clean = bClient.ws.futuresAggTrades([symbol], (trade) => {
            // if (++cnt > 200) {
            // return
            // }
            setData((_d) => {
                let d = createTick({ trade })
                let nd = [..._d, d]
                if (nd[nd.length - 1].x - nd[0].x > 600000) {
                    nd.shift()
                }
                return nd
            })
        })

        return () => {
            clean?.()
        }
    }, [symbol])

    // consider the direction of the array, where is the last, where is the most recent

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
    //                     return acc + v.y
    //                 }, 0) / 2
    //             let newTick = { ...toavg[0] }
    //             newTick.y = avgPrice
    //             idata[n].push(newTick)
    //         }
    //         if (!continueN) {
    //             break
    //         }
    //     }
    //     setInterpolatedData(idata)
    // }, [rawData, interpolatedData])

    const [sliceLength, setSliceLength] = useState(1000)
    const [slicedData, setSlicedData] = useState(data)

    useEffect(() => {
        // console.log('sliceLength', sliceLength, data.length, data.slice(sliceLength * -1).length)
        if (sliceLength < data.length) {
            if (sliceLength < 20) {
                setSlicedData(data)
            }
            setSlicedData(data.slice(sliceLength * -1))
        } else {
            setSlicedData(data)
        }
    }, [sliceLength, data])

    // console.log('slicedData', slicedData)
    const Line = LineSeries

    // console.log('data.slice(0, 20)', data.slice(0, 20))

    // console.log(
    // 'slicedData',
    // slicedData.map((t) => t.timestamp)
    // )

    // console.log(
    // 'data',
    // data.length,
    // data.map((d) => d.timestamp)
    // )

    // console.log(
    //     'data.map((d) => d.x)',
    //     data.map((d) => d.x),
    //     data.map((d) => d.y),
    //     data.length
    // )
    // data = data.map((d) => ({ ...d, x: new Date(d.timestamp) }))

    // data = [
    //     1632369423219, 1632369423219, 1632369423219, 1632369423219, 1632369423235, 1632369423747,
    //     1632369426239, 1632369427210, 1632369427210, 1632369427210,
    // ].map((x, i) => ({
    //     x,
    //     y: [21.983, 21.984, 21.987, 21.988, 21.988, 21.977, 21.976, 21.977, 21.978, 21.979][i],
    // }))

    // console.log('data', data)

    return <Trade isReactVis={true} />

    /* eslint-disable no-unreachable */
    return (
        <div className={styles.container}>
            {/* <div
                 draggable={true}
                 style={{ userSelect: 'none' }}
                 onDragEnter={(e) => console.log('move', e.movementY)}
             >
                 aaaaa
             </div> */}
            <div
                onWheel={(w) => {
                    setSliceLength((sl) => {
                        if (w.deltaY > 0 && sl > 200) {
                            return sl - (w.deltaY * Math.round(Math.sqrt(sl))) / 30
                        }
                        if (w.deltaY < 0 && sl < refData.current.length - 200) {
                            return sl - (w.deltaY * Math.round(Math.sqrt(sl))) / 30
                        }
                        return sl
                    })
                }}
            >
                <XYPlot width={1500} height={1000}>
                    {/* <HorizontalGridLines /> */}
                    {/* <VerticalGridLines /> */}
                    <Line
                        data={data}
                        // curve='curveLinear'
                    />
                    <XAxis
                        // tickValues={data.map((d) => d.timestamp)}
                        tickTotal={10}
                        tickFormat={(v) => {
                            return dayjs(v).format('HH-mm-ss-sss')
                        }}

                        // tickTotal={100}
                    />
                    <YAxis width={70} tickTotal={10} />
                </XYPlot>
            </div>

            {/* {typeof window !== 'undefined' && <StockChartExported />} */}
            {false && (
                <main className={styles.main}>
                    <VStack spacing={100}>
                        <ButtonGroup variant='solid' size='lg' spacing='20'>
                            <Button
                                colorScheme='darkred'
                                onClick={async () => {
                                    let data = await wretch('/api/getStatus').post().json()
                                }}
                            >
                                Get Status
                            </Button>
                        </ButtonGroup>
                        <ButtonGroup variant='solid' size='lg' spacing='20'>
                            <Button
                                colorScheme='darkgreen'
                                onClick={async () => {
                                    let data = await wretch('/api/testStartLimit')
                                        .post({
                                            isLong: true,
                                            symbol: symbol,
                                            decimals: symbols[symbol].decimals,
                                            quantity: quantity,
                                        })
                                        .json()
                                    console.table(data)
                                }}
                            >
                                Long - test start limit
                            </Button>
                            <Button
                                colorScheme='darkred'
                                onClick={async () => {
                                    let data = await wretch('/api/testStartLimit')
                                        .post({
                                            isLong: false,
                                            symbol: symbol,
                                            decimals: symbols[symbol].decimals,
                                            quantity: quantity,
                                        })
                                        .json()
                                    console.table(data)
                                }}
                            >
                                Short - test start limit
                            </Button>
                        </ButtonGroup>
                        <ButtonGroup variant='solid' size='lg' spacing='20'>
                            <Button
                                colorScheme='darkgreen'
                                onClick={() =>
                                    wretch('/api/simple').post({
                                        isLong: true,
                                        symbol: symbol,
                                        decimals: symbols[symbol].decimals,
                                        quantity: quantity,
                                        stopLossPips: stopLossPips,
                                        takeProfitLimitPips: takeProfitLimitPips,
                                    })
                                }
                            >
                                Long
                            </Button>
                            <Button
                                colorScheme='darkred'
                                onClick={() =>
                                    wretch('/api/simple').post({
                                        isLong: false,
                                        symbol: symbol,
                                        decimals: symbols[symbol].decimals,
                                        quantity: quantity,
                                        stopLossPips: stopLossPips,
                                        takeProfitLimitPips: takeProfitLimitPips,
                                    })
                                }
                            >
                                Short
                            </Button>
                        </ButtonGroup>
                        <HStack>
                            <FormControl id='form1'>
                                <FormLabel>Symbol</FormLabel>
                                <Select
                                    defaultValue={symbol}
                                    placeholder='Select symbol'
                                    onChange={(e) => {
                                        setSymbol(e.target.value as TSymbols)
                                    }}
                                >
                                    <option>BTCUSDT</option>
                                    <option>SOLUSDT</option>
                                    <option>XRPUSDT</option>
                                    <option>LTCUSDT</option>
                                </Select>
                            </FormControl>
                            <FormControl id='form2'>
                                <FormLabel>Quantity</FormLabel>
                                <Input
                                    type='text'
                                    defaultValue={quantity}
                                    onChange={(e) => {
                                        setQuantity(+e.target.value)
                                    }}
                                />
                            </FormControl>
                            <FormControl id='form3'>
                                <FormLabel>Stop Loss (pips)</FormLabel>
                                <Input
                                    value={stopLossPips}
                                    onChange={(e) => {
                                        setStopLossPips(+e.target.value)
                                    }}
                                />
                            </FormControl>
                        </HStack>
                    </VStack>
                </main>
            )}

            {false && (
                <footer className={styles.footer}>
                    <div>
                        <div>{new Array(refetchCnt).fill('*').join('')}</div>
                        {latest && (
                            <div>
                                latest: {latest}
                                {prev && <span> {latest > prev ? ' UP' : ' DOWN'}</span>}
                            </div>
                        )}
                    </div>
                </footer>
            )}
        </div>
    )
}

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
export default Home

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
// if (roundDecimals(Math.abs(last - price), 2) <= 1 / 10 ** symbols[symbol].decimals &&
//     roundDecimals(Math.abs(beforelast - last), 2) <= 1 / 10 ** symbols[symbol].decimals &&
//     beforelast === price
// ) {
//     price = beforelast
// }
//   console.log(Math.abs(last - price), last, '=>', pprice, '=>', price, '|||', cnt++)

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
