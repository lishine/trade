import { proxy, subscribe, useSnapshot } from 'valtio'
import { derive } from 'valtio/utils'
import { calcExitPrice, calcLossPrice, symbols, TSymbols, TTick } from '~/features/Trade/localConstants'

export const state = proxy({
    symbol: 'LTCUSDT' as TSymbols,
    investment: 100,
    profit: 0.1,
    loss: 0.1,
    isLong: true,
    slicedDataLength: 1000,
    lastPrice: 0,
})

export const derivedState = derive({
    decimals: (get) => {
        return symbols[get(state).symbol].decimals
    },
    exitPrice: (get) => {
        return calcExitPrice({
            enterPrice: get(state).lastPrice,
            investment: get(state).investment,
            isLong: get(state).isLong,
            symbol: get(state).symbol,
            profit: get(state).profit,
        })
    },
    stopLossPrice: (get) => {
        return calcLossPrice({
            enterPrice: get(state).lastPrice,
            investment: get(state).investment,
            isLong: get(state).isLong,
            symbol: get(state).symbol,
            loss: get(state).loss,
        })
    },
})

export const dataState = proxy({
    data: [] as TTick[],
    dataWs: [] as TTick[],
    dataDirect: [] as TTick[],
    dataAvg: [] as TTick[][],
    slicedData: [] as TTick[],
    aggData: [] as TTick[][],
})
