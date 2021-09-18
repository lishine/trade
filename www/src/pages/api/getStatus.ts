import type { NextApiRequest, NextApiResponse } from 'next'
import { SYMBOL } from './__/constants'
import { client } from './__/client'
import { RequestContext, wrapRoute } from './__/common'
import { ApiHelloResult } from './__/types'
// import { binance } from '~/pages/api/__/binanceClient'

// import { USDMClient, WebsocketClient } from 'binance'

// const wsClient = new WebsocketClient({ beautify: true })

// wsClient.subscribeAggregateTrades('LTCUSDT', 'coinm')
// wsClient.on('message', (data) => {
//     console.log('raw message received ', JSON.stringify(data, null, 2))
// })
import dayjs from 'dayjs'

// import Binance from 'binance-api-node'

// const bClient = Binance()

// let clean = bClient.ws.futuresAggTrades(['LTCUSDT'], (trade) => {
//     console.log(trade)
// })

// setTimeout(() => {
//     clean()
// }, 10000)

const getLastPrice = async ({ symbol }: { symbol: string }) => {
    let d = await client.getTickers({ symbol }).catch((err) => {
        console.error(err)
    })
    return d.result[0].last_price
}

const getStatus = async (req: RequestContext, res: NextApiResponse) => {
    let symbol = req.body.symbol

    // binance.futuresAggTradeStream('LTCUSDT', (d: any) => console.log(d))

    // let data = await binanceClient.futuresTrades('LTCUSDT')
    // let mapedData = data.map((d: any) => [dayjs(d.time).format('HH:MM:ss'), d.price])
    // console.log(mapedData)
    // binance.websockets.candlesticks(['LTCUSDT'], '1m', (candlesticks: any) => {
    //     let { e: eventType, E: eventTime, s: symbol, k: ticks } = candlesticks
    //     let {
    //         o: open,
    //         h: high,
    //         l: low,
    //         c: close,
    //         v: volume,
    //         n: trades,
    //         i: interval,
    //         x: isFinal,
    //         q: quoteVolume,
    //         V: buyVolume,
    //         Q: quoteBuyVolume,
    //     } = ticks
    //     console.info(symbol + ' ' + interval + ' candlestick update')
    //     console.info('open: ' + open)
    //     console.info('high: ' + high)
    //     console.info('low: ' + low)
    //     console.info('close: ' + close)
    //     console.info('volume: ' + volume)
    //     console.info('isFinal: ' + isFinal)
    // })

    // binance.websockets.trades(['BTCUSDT'], (trades: any) => {
    //     let { e: eventType, E: eventTime, s: symbol, p: price, q: quantity, m: maker, a: tradeId } = trades
    //     console.info(
    //         symbol + ' trade update. price: ' + price + ', quantity: ' + quantity + ', maker: ' + maker
    //     )
    // })

    // binance.trades('LTCUSDT', (error: any, trades: any, symbol: any) => {
    // console.info(error, symbol + ' trade history', trades)
    // })

    // let latest = await getLastPrice({ symbol: symbol })
    // let ret = { latest }

    // let trades = await client.getTrades({ symbol: symbol })
    // console.log('trades.result', trades.result)

    return {}
    // return ret as ApiHelloResult
}

export default wrapRoute(getStatus)
