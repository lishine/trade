import { symbols } from '~/features/Trade/localConstants'
import { bClient, createTick } from '~/features/Trade/utils'
import {
    AggregatedTrade,
    ReconnectingWebSocketHandler,
    SymbolLotSizeFilter,
    SymbolMinNotionalFilter,
    SymbolPriceFilter,
} from 'binance-api-node'
import { dataState } from '~/features/Trade/state/dataState'

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

    // let prices = await bClient.futuresPrices()
    // let obj: Record<string, any> = {}
    // Object.keys(symbols).forEach((symbol) => {
    //     let filters = eInfo.symbols.find((s) => s.symbol === symbol)?.filters
    //     let tickSize = +(filters?.find((f) => f.filterType === 'PRICE_FILTER') as SymbolPriceFilter)?.tickSize
    //     let minPrice = +(filters?.find((f) => f.filterType === 'PRICE_FILTER') as SymbolPriceFilter)?.minPrice
    //     let quantityStepSize = +(filters?.find((f) => f.filterType === 'LOT_SIZE') as SymbolLotSizeFilter)
    //         ?.stepSize
    //     let minQuantity = +(filters?.find((f) => f.filterType === 'LOT_SIZE') as SymbolLotSizeFilter)?.minQty
    //     let minNotional = +(filters?.find((f) => f.filterType === 'MIN_NOTIONAL') as SymbolMinNotionalFilter)
    //         ?.minNotional
    //     // let price = +prices[symbol]
    //     obj[symbol] = {
    //         // price,
    //         // minPrice,
    //         tickSize,
    //         quantityStepSize,
    //         // minQuantity,
    //         // minNotional,
    //     }
    // })
    // console.table(obj)

    eInfo.symbols.forEach((symbolObj) => {
        let { filters, symbol } = symbolObj
        let tickSize = +(filters?.find((f) => f.filterType === 'PRICE_FILTER') as SymbolPriceFilter)?.tickSize
        let quantityStepSize = +(filters?.find((f) => f.filterType === 'LOT_SIZE') as SymbolLotSizeFilter)
            ?.stepSize
        dataState.symbols[symbol] = { tickSize, quantityStepSize }
    })
}
