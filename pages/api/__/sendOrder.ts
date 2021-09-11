import { priceAddPercent } from '../../../utils'
import { client, getLastPrice } from './client'
import {
    DECIMALS,
    IS_POST_ONLY,
    IS_START_LIMIT,
    PRICE_LIMIT_START_PERCENT,
    STOP_LOSS_PERCENT,
    SYMBOL,
    TAKE_PROFIT_PERCENT,
} from './constants'
import { ApiHelloResult } from './types'

export const sendOrder = async ({
    isBuy,
    isOpen,
    isClose,
}: {
    isBuy: boolean
    isOpen?: boolean
    isClose?: boolean
    }) => {
    isOpen && console.log(`opening ${isBuy? 'Long': 'Short'} order`)
    isClose && console.log(`setting limit for ${isBuy? 'Long': 'Short'} order`)
    
    let latest = await getLastPrice({ symbol: SYMBOL })

    if (!isOpen && !isClose) {
        throw Error('_placeOrder: must provide either close or open true')
    }
    let _isStartLimit = IS_START_LIMIT || isClose
    let _isPostOnly = (IS_POST_ONLY && IS_START_LIMIT) || isClose
    let _isBuy = isOpen ? isBuy : !isBuy

    let common = {
        symbol: SYMBOL,
        order_type: _isStartLimit ? 'Limit' : 'Market',
        qty: 100,
        time_in_force: _isPostOnly ? 'PostOnly' : 'GoodTillCancel',
        close_on_trigger: !!isClose,
        reduce_only: !!isClose,
    }

    let placeOrderParams = Object.assign(
        {},
        common,
        { side: _isBuy ? 'Buy' : 'Sell' },
        isOpen &&
            {
                // stop_loss: priceAddPercent({
                //     price: latest,
                //     percent: STOP_LOSS_PERCENT,
                //     isPlus: !_isBuy,
                //     decimals: DECIMALS,
                // }),
            },
        _isStartLimit && {
            price: priceAddPercent({
                price: latest,
                percent: isOpen ? PRICE_LIMIT_START_PERCENT : TAKE_PROFIT_PERCENT,
                isPlus: !_isBuy,
                decimals: DECIMALS,
            }),
        }
    )

    console.log(placeOrderParams)

    let data = await client.placeActiveOrder(placeOrderParams).catch(err => {
        console.error(err)
    })

    let ret = data

    return ret as ApiHelloResult
}
