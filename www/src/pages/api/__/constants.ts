import { roundDecimals } from '../../../utils'

// export const SYMBOL = 'XRPUSDT'
// export const DECIMALS = 4
// export const QUANTITY = 100
// export const SYMBOL = 'BTCUSDT'
// export const DECIMALS = 0
// export const QUANTITY = 0.003

export const SYMBOL = 'SOLUSDT'
export const DECIMALS = 2
export const QUANTITY = 18

// export const SYMBOL = 'ETHUSDT'
// export const DECIMALS = 0
// export const QUANTITY = 0.04

export const TAKER_FEE = 0.075
export const MAKER_FEE = 0.025
export const TAKE_PROFIT_PIPS = 3

export const IS_START_LIMIT = true
export const IS_POST_ONLY = true

export const PRICE_LIMIT_START_PIPS = 1
export const PRICE_LIMIT_END_PIPS = 4
export const STOP_LOSS_PIPS = 10

export const calcLimitPrice = ({
    isPlus,
    price,
    pips,
    decimals,
}: {
    isPlus: boolean
    price: number
    pips: number
    decimals: number
}) => {
    let addPrice = priceFromPips({ pips, decimals })
    let p = price + (isPlus ? 1 : -1) * addPrice
    return roundDecimals(p, decimals)
}

export const priceFromPips = ({ decimals, pips }: { pips: number; decimals: number }) => {
    let n = pips / 10 ** decimals
    let r = roundDecimals(n, decimals)
    return r
}

export const getPricePips = ({ decimals }: { decimals: number }) => priceFromPips({ pips: 1, decimals })

export const calcStartLimitPrice = ({
    isBuy,
    price,
    pips,
    decimals,
}: {
    isBuy: boolean
    price: number
    pips: number
    decimals: number
}) => {
    return calcLimitPrice({ isPlus: !isBuy, price, pips, decimals })
}

export const calcEndLimitPrice = ({
    isLong,
    price,
    pips,
    decimals,
}: {
    isLong: boolean
    price: number
    pips: number
    decimals: number
}) => {
    return calcLimitPrice({ isPlus: isLong, price, pips, decimals })
}

export const calcStopLossPrice = ({
    isLong,
    price,
    pips,
    decimals,
}: {
    isLong: boolean
    price: number
    pips: number
    decimals: number
}) => {
    return calcLimitPrice({ isPlus: !isLong, price, pips, decimals })
}
