import { priceAddPercent } from '../../../utils'
import { client, getLastPrice } from './client'
import {
    DECIMALS,
    calcStartLimitPrice,
    calcEndLimitPrice,
    IS_POST_ONLY,
    IS_START_LIMIT,
    PRICE_LIMIT_START_PIPS,
    SYMBOL,
    TAKE_PROFIT_PIPS,
    STOP_LOSS_PIPS,
    calcStopLossPrice,
} from './constants'
import { ApiHelloResult } from './types'

const common = {
    symbol: SYMBOL,
    order_type: 'Limit',
    qty: 100,
    time_in_force: 'PostOnly',
    close_on_trigger: true,
    reduce_only: true,
}

export const sendOpenOrder = async ({ isBuy }: { isBuy: boolean }) => {
    console.log(`opening ${isBuy ? 'Long' : 'Short'} order`)

    let latest = await getLastPrice({ symbol: SYMBOL })

    let _isStartLimit = IS_START_LIMIT
    let _isPostOnly = IS_POST_ONLY && IS_START_LIMIT

    let common = {
        symbol: SYMBOL,
        order_type: IS_START_LIMIT ? 'Limit' : 'Market',
        qty: 100,
        time_in_force: _isPostOnly ? 'PostOnly' : 'GoodTillCancel',
        close_on_trigger: false,
        reduce_only: false,
    }

    let placeOrderParams = Object.assign(
        {},
        common,
        { side: isBuy ? 'Buy' : 'Sell' },
        _isStartLimit && {
            price: calcStartLimitPrice({
                isBuy: isBuy,
                price: latest,
                pips: PRICE_LIMIT_START_PIPS,
                decimals: DECIMALS,
            }),
        }
    )

    console.log(placeOrderParams)

    let data = await client.placeActiveOrder(placeOrderParams).catch((err) => {
        console.error(err)
    })

    return data
}

export const sendCloseOrder = async ({
    isBuy,
    decimals,
    limitTakeProfitPips,
    symbol,
}: {
    symbol: string
    isBuy: boolean
    decimals: number
    limitTakeProfitPips: number
}) => {
    console.log(`setting limit for ${isBuy ? 'Long' : 'Short'} order`)

    let latest = await getLastPrice({ symbol: symbol })

    let placeOrderParams = Object.assign(
        {},
        common,
        { side: !isBuy ? 'Buy' : 'Sell' },
        {
            price: calcEndLimitPrice({
                isLong: isBuy,
                price: latest,
                pips: limitTakeProfitPips,
                decimals: decimals,
            }),
        }
    )

    console.log(placeOrderParams)

    let data = await client.placeActiveOrder(placeOrderParams).catch((err) => {
        console.error(err)
    })

    return data
}
