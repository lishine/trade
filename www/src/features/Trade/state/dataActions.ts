import {
    AggregatedTrade,
    ReconnectingWebSocketHandler,
    SymbolLotSizeFilter,
    SymbolMinNotionalFilter,
    SymbolPriceFilter,
} from 'binance-api-node'
import { proxy } from 'valtio'
import { symbols, TTick } from '~/features/Trade/localConstants'
import { dataState, state } from '~/features/Trade/state/state'
import { bClient, createTick } from '~/features/Trade/utils'
import { JSONstringify, sleep, waitForStateOnce } from '~/utils'

let clean: ReconnectingWebSocketHandler | undefined
export const wsSubscribeCurrentPrice = () => {
    clean?.()
    clean = bClient.ws.futuresAggTrades([state.symbol], (trade) => {
        let d = createTick({ trade })
        dataState.data.push(d)
        state.lastPrice = d.price
        if (dataState.data[dataState.data.length - 1].timestamp - dataState.data[0].timestamp > 600000) {
            dataState.data.shift()
        }
    })
}

export const getExchangeInfo = async () => {
    let eInfo = await bClient.exchangeInfo()
    // eInfo.symbols.forEach((symbol) => {
    //     let filters = symbol?.filters
    //     if (filters) {
    //         let minNotional = +(
    //             filters?.find((f) => f.filterType === 'MIN_NOTIONAL') as SymbolMinNotionalFilter
    //         )?.minNotional
    //         console.log(symbol.symbol, minNotional)
    //     }
    // })

    let prices = await bClient.futuresPrices()
    let obj: Record<string, any> = {}
    Object.keys(symbols).forEach((symbol) => {
        let filters = eInfo.symbols.find((s) => s.symbol === symbol)?.filters
        let tickSize = +(filters?.find((f) => f.filterType === 'PRICE_FILTER') as SymbolPriceFilter)?.tickSize
        let minPrice = +(filters?.find((f) => f.filterType === 'PRICE_FILTER') as SymbolPriceFilter)?.minPrice
        let quantityStepSize = +(filters?.find((f) => f.filterType === 'LOT_SIZE') as SymbolLotSizeFilter)
            ?.stepSize
        let minQuantity = +(filters?.find((f) => f.filterType === 'LOT_SIZE') as SymbolLotSizeFilter)?.minQty
        let minNotional = +(filters?.find((f) => f.filterType === 'MIN_NOTIONAL') as SymbolMinNotionalFilter)
            ?.minNotional
        let price = +prices[symbol]
        obj[symbol] = {
            price,
            minPrice,
            tickSize,
            quantityStepSize,
            minQuantity,
            minNotional,
        }
    })
    console.table(obj)
}

export const loadData = () => {
    waitForStateOnce([dataState.data], async () => {
        console.log('loading past trades')
        for (let index = 0; index < 100; index++) {
            let aggTrades: AggregatedTrade[] = []
            aggTrades = await bClient.futuresAggTrades({
                symbol: state.symbol,
                endTime: dataState.data[0].timestamp - 1,
                limit: 500,
            })
            let mappedTrades = aggTrades.map((t) => createTick({ trade: t }))

            dataState.data.unshift(...mappedTrades)

            let startTimestamp = mappedTrades[0].timestamp
            let endTimestamp = dataState.data[dataState.data.length - 1].timestamp
            if ((endTimestamp - startTimestamp) / 60000 > 60) {
                break
            }
            await sleep(10)
        }
        state.slicedDataLength = dataState.data.length
    })
}
