import { useHandler } from 'react-handler-hooks'
import { useEffect, useState } from 'react'
import { useLatest, useFirstMountState, useMountedState } from 'react-use'
import styles from '~/styles/home.module.scss'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ReferenceLine } from 'recharts'
import { AggregatedTrade, ReconnectingWebSocketHandler } from 'binance-api-node'

import { sleep } from '~/utils'
import { getExitPrice, getLossPrice, symbols, TSymbols, TTick } from '~/features/Trade/localConstants'
import { bClient, createTick } from '~/features/Trade/dataUtils'
import { RefLabel } from '~/features/Trade/RefLabel'
import { UI } from '~/features/Trade/UI'
import wretch from 'wretch'

let cnt = 0

export const Trade = () => {
    const [symbol, setSymbol] = useState<TSymbols>('DGBUSDT')
    const [investment, setInvestment] = useState(100)
    const [profit, setProfit] = useState(0.1)
    const [loss, setLoss] = useState(0.1)
    const [isLong, setIsLong] = useState(true)

    const [data, setData] = useState<TTick[]>([])
    let refData = useLatest(data)
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        let clean: ReconnectingWebSocketHandler | undefined

        setLoaded(false)
        setData([])
        let cnt = 0
        clean = bClient.ws.futuresAggTrades([symbol], (trade) => {
            // if (cnt > 1) {
            // return
            // }
            // cnt++
            setData((_d) => {
                let d = createTick({ trade })
                let nd = [..._d, d]
                if (nd[nd.length - 1].timestamp - nd[0].timestamp > 600000) {
                    nd.shift()
                }
                return nd
            })
        })

        return () => {
            // try {
            // clean?.()
            // } catch (error) {
            // error
            // }
        }
    }, [symbol])

    useEffect(() => {
        if (!loaded && data.length) {
            setLoaded(true)
            let fn = async () => {
                for (let index = 0; index < 100; index++) {
                    console.log('loading past trades')
                    let aggTrades: AggregatedTrade[] = []
                    aggTrades = await bClient.futuresAggTrades({
                        symbol: symbol,
                        endTime: refData.current[0].timestamp - 1,
                        limit: 500,
                    })
                    let mappedTrades = aggTrades.map((t) => createTick({ trade: t }))

                    setData((d) => {
                        return [...mappedTrades, ...d]
                    })

                    let startTimestamp = mappedTrades[0].timestamp
                    let endTimestamp = refData.current[refData.current.length - 1].timestamp
                    if ((endTimestamp - startTimestamp) / 60000 > 60) {
                        break
                    }
                    await sleep(10)
                }
                setSliceLength(refData.current.length)
            }
            fn()
        }
    }, [symbol, loaded, data, refData])

    const [sliceLength, setSliceLength] = useState(1000)
    const [slicedData, setSlicedData] = useState(data)

    useEffect(() => {
        if (sliceLength < 20) {
            return
        }
        setSlicedData(data.slice(sliceLength * -1))
    }, [sliceLength, data])

    const [lastPrice, setLastPrice] = useState(0)
    useEffect(() => {
        if (slicedData.length) {
            setLastPrice(slicedData[slicedData.length - 1].price)
        }
    }, [slicedData])

    let exitPrice = getExitPrice({
        enterPrice: lastPrice,
        investment: investment,
        isLong: isLong,
        symbol: symbol,
        profit: profit,
    })

    let stopLossPrice = getLossPrice({
        enterPrice: lastPrice,
        investment: investment,
        isLong: isLong,
        symbol: symbol,
        loss: loss,
    })

    console.log('isLong', isLong)

    return (
        <div>
            <UI
                isLong={isLong}
                onDirectionChange={(isLong: boolean) => {
                    setIsLong(isLong)
                }}
                placeOrder={() => {
                    wretch('/api/placeBinanceOrder')
                        .post({
                            isLong,
                            symbol: symbol,
                            quantity: investment / lastPrice,
                            exitPrice: exitPrice,
                            stopLossPrice: stopLossPrice,
                        })
                        .json()
                }}
                anyObject={{}}
            />
            <div
                onWheel={(w) => {
                    setSliceLength((sl) => {
                        if (w.deltaY > 0 && sl > 200) {
                            return sl - w.deltaY
                        }
                        if (w.deltaY < 0 && sl < refData.current.length - 200) {
                            return sl - w.deltaY
                        }
                        return sl
                    })
                }}
            >
                <LineChart width={1900} height={880} data={slicedData}>
                    <ReferenceLine
                        y={lastPrice}
                        label={<RefLabel color='green' label={lastPrice} />}
                        color='green'
                        stroke='green'
                        strokeDasharray='3 3'
                    />
                    <ReferenceLine
                        alwaysShow
                        y={exitPrice}
                        label={<RefLabel color='blue' label={exitPrice} />}
                        stroke='blue'
                        strokeDasharray='3 3'
                    />
                    <ReferenceLine
                        alwaysShow
                        y={stopLossPrice}
                        label={<RefLabel color='red' label={stopLossPrice} />}
                        stroke='red'
                        strokeDasharray='3 3'
                    />
                    <Line
                        isAnimationActive={false}
                        type='monotone'
                        dataKey='price'
                        stroke='#2A62FF'
                        strokeWidth={1}
                        dot={false}
                        // dot={{ stroke: 'grey', strokeWidth: 1 }}
                    />
                    {/* <CartesianGrid stroke='#ccc' strokeDasharray='7 7' /> */}
                    <XAxis
                        dataKey='time'
                        // tickCount={100}
                        minTickGap={100}
                    />
                    <YAxis
                        tickCount={10}
                        type='number'
                        domain={['dataMin', 'dataMax']}
                        padding={{
                            top: 0,
                            bottom: 20,
                        }}
                        width={100}
                        tickFormatter={(n: number) => n.toFixed(symbols[symbol].decimals)}
                    />
                </LineChart>
            </div>
        </div>
    )
}
