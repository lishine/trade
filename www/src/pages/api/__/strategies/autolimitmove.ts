import { TAKE_PROFIT_PIPS, DECIMALS, IS_START_LIMIT, SYMBOL } from '../constants'
import { ApiHelloResult } from '../types'
import { addStopLoss, checkCloseLimit, tillFillOrder, waitOrderFilled } from '../adjustLimits'
import { sendCloseOrder, sendOpenOrder } from '../sendOrder'

export const autolimitmove = async ({ isBuy }: { isBuy: boolean }) => {
    let openOrderData = await sendOpenOrder({ isBuy })

    if (openOrderData.ret_msg !== 'OK') {
        console.error('could not open order', openOrderData)
        return {}
    }

    let openOrderId = openOrderData.result.order_id

    let isFilled = true
    if (IS_START_LIMIT) {
        isFilled = await tillFillOrder({
            orderId: openOrderId,
            isBuy: isBuy,
            isStart: true,
        })
    }
    if (!isFilled) {
        console.error('could not fill open order')
        return {}
    }

    addStopLoss({ orderId: openOrderId, isBuy: isBuy })

    let closeData = await sendCloseOrder({
        symbol: SYMBOL,
        isBuy,
        decimals: DECIMALS,
        limitTakeProfitPips: TAKE_PROFIT_PIPS,
    })
    if (closeData.ret_msg !== 'OK') {
        console.error('could not activate close order', closeData)
        return {}
    }

    let stopLossProcedure = await checkCloseLimit({
        orderId: closeData.result.order_id,
        isBuy: isBuy,
    })

    if (stopLossProcedure) {
        tillFillOrder({
            orderId: closeData.result.order_id,
            isBuy: isBuy,
            isStart: false,
        })
    }

    return {} as ApiHelloResult
}
