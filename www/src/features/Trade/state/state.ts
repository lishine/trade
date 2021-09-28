import { proxy, subscribe, useSnapshot } from 'valtio'
import { proxyWithComputed, derive } from 'valtio/utils'
import { calcExitPrice, calcLossPrice, symbols, TSymbols, TTick } from '~/features/Trade/localConstants'

export const state = proxy({
    symbol: 'LTCUSDT',
    investment: 100,
    profit: 0.1,
    loss: 0.1,
    isLong: true,
    zoomOutLevel: 0,
    lastPrice: 0,
})

export const derivedState = derive({
    // decimals: (get) => {
    //     return symbols[get(state).symbol].decimals
    // },
    // exitPrice: (get) => {
    //     return calcExitPrice({
    //         enterPrice: get(state).lastPrice,
    //         investment: get(state).investment,
    //         isLong: get(state).isLong,
    //         symbol: get(state).symbol,
    //         profit: get(state).profit,
    //     })
    // },
    // stopLossPrice: (get) => {
    //     return calcLossPrice({
    //         enterPrice: get(state).lastPrice,
    //         investment: get(state).investment,
    //         isLong: get(state).isLong,
    //         symbol: get(state).symbol,
    //         loss: get(state).loss,
    //     })
    // },
})
