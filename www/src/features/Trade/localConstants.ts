import { roundDecimals } from '~/utils'

export type TTick = {
    timestamp: number
    time: string
    price: number
}

export let symbols = {
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
export type TSymbols = keyof typeof symbols

export const _Binance_Market_Fee = 0.036
export const _Binance_Limit_Fee = 0.018

export const getExitPrice = ({
    symbol,
    enterPrice,
    isLong,
    profit,
    investment,
}: {
    symbol: TSymbols
    profit: number
    isLong: boolean
    enterPrice: number
    investment: number
}) => {
    let quantity = investment / enterPrice
    let fees = (investment * (_Binance_Market_Fee + _Binance_Limit_Fee)) / 100
    let exitPrice = (investment + (profit + fees) * (isLong ? 1 : -1)) / quantity
    return roundDecimals(exitPrice, symbols[symbol].decimals)
}

export const getLossPrice = ({
    symbol,
    enterPrice,
    isLong,
    loss,
    investment,
}: {
    symbol: TSymbols
    loss: number
    isLong: boolean
    enterPrice: number
    investment: number
}) => {
    let quantity = investment / enterPrice
    let fees = (investment * (_Binance_Market_Fee * 2)) / 100
    let exitPrice = (investment + (loss + fees) * (isLong ? 1 : -1) * -1) / quantity
    return roundDecimals(exitPrice, symbols[symbol].decimals)
}
