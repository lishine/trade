import { tillFillOrder } from '~/pages/api/__/adjustLimits'
import { check, client, getLastPrice } from '~/pages/api/__/client'
import { calcStartLimitPrice, calcEndLimitPrice, calcStopLossPrice } from '~/pages/api/__/constants'
import { sendCloseOrder } from '~/pages/api/__/sendOrder'

export const sendSimpleOrder = async ({
    isLong,
    symbol,
    decimals,
    quantity,
    stopLossPips,
    takeProfitLimitPips,
}: {
    symbol: string
    decimals: number
    quantity: number
    takeProfitLimitPips: number
    stopLossPips: number
    isLong: boolean
}) => {
    console.log('sendSimpleOrder', {
        isLong,
        symbol,
        decimals,
        quantity,
        stopLossPips,
        takeProfitLimitPips,
    })

    let latest = await getLastPrice({ symbol: symbol })

    let orderParams: Parameters<typeof client.placeActiveOrder>[0] = {
        side: isLong ? 'Buy' : 'Sell',
        symbol: symbol,
        order_type: 'Market',
        qty: quantity,
        time_in_force: 'GoodTillCancel',
        close_on_trigger: false,
        reduce_only: false,
        stop_loss: calcStopLossPrice({
            isLong,
            price: latest,
            pips: stopLossPips,
            decimals: decimals,
        }),
    }

    let openOrderData = await client.placeActiveOrder(orderParams)
    console.log('open order params', orderParams)
    console.log('opend order data', openOrderData)
    if (check(openOrderData)) {
        console.log('GOOD, opened order')
    } else {
        console.log('ERROR opening placing')
    }

    let openOrderId = openOrderData.result.order_id

    if (takeProfitLimitPips) {
        let isFilled = await tillFillOrder({
            orderId: openOrderId,
            isBuy: isLong,
            isStart: true,
        })
        if (!isFilled) {
            console.error('could not fill open order')
            return {}
        }

        let closeOrderParams: Parameters<typeof sendCloseOrder>[0] = {
            symbol: symbol,
            isBuy: isLong,
            decimals: decimals,
            limitTakeProfitPips: takeProfitLimitPips,
        }

        let closeOrderData = await sendCloseOrder(closeOrderParams)
        if (check(closeOrderData)) {
            console.error('GOOD sent close order', closeOrderParams, closeOrderData)
        } else {
            console.error('ERROR could not activate close order', closeOrderParams, closeOrderData)
            return {}
        }
    }

    return openOrderData
}
