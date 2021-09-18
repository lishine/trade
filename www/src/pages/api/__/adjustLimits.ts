import { sleep } from '../../../utils'
import {
    calcEndLimitPrice,
    calcStartLimitPrice,
    calcStopLossPrice,
    priceFromPips,
    PRICE_LIMIT_END_PIPS,
    PRICE_LIMIT_START_PIPS,
    STOP_LOSS_PIPS,
    SYMBOL,
    TAKE_PROFIT_PIPS,
    DECIMALS,
} from './constants'
import { cancelActiveOrder, getLastPrice, modifyActiveOrder, queryActiveOrder } from './client'

const WAIT_ORDER_FILLED_TIMEOUT = 190000
const QUERY_ORDER_STATUS_INTERVAL = 1000

export const waitOrderFilled = async ({
    orderId,
    isBuy,
    isStart,
}: {
    orderId: string
    isBuy: boolean
    isStart: boolean
}) => {
    const nWaitOrderFilled = WAIT_ORDER_FILLED_TIMEOUT / QUERY_ORDER_STATUS_INTERVAL
    for (let i = 0; i < nWaitOrderFilled; i++) {
        let openOrderQueryData: any
        try {
            openOrderQueryData = await queryActiveOrder({ orderId, symbol: SYMBOL })
        } catch (error) {
            console.log('error', error)
            break
        }
        console.log(
            'openOrderQueryData?.result.order_status',
            openOrderQueryData?.result.order_status,
            openOrderQueryData?.result.order_id
        )
        let isFilled = openOrderQueryData?.result.order_status === 'Filled'
        let isCancelled = openOrderQueryData?.result.order_status === 'Cancelled'
        if (isFilled) {
            return true
        } else if (isCancelled) {
            console.error('order cancelled', openOrderQueryData)
            return false
        }

        // let oldLimitPrice = openOrderQueryData?.result.price
        // let latest = await getLastPrice({ symbol: SYMBOL })

        // let pips: number
        // let _isBuy: boolean
        // if (isStart) {
        //     _isBuy = isBuy
        //     pips = PRICE_LIMIT_START_PIPS
        // } else {
        //     _isBuy = !isBuy
        //     pips = PRICE_LIMIT_END_PIPS
        // }
        // let newLimitPrice = calcStartLimitPrice({
        //     isBuy: _isBuy,
        //     price: latest,
        //     pips: pips,
        //     decimals: DECIMALS,
        // })

        // let shouldUpdateLimitPrice = false
        // if (latest !== oldLimitPrice) {
        //     if (_isBuy ? latest > oldLimitPrice : latest < oldLimitPrice) {
        //         shouldUpdateLimitPrice = newLimitPrice !== oldLimitPrice
        //     } else {
        //         shouldUpdateLimitPrice = true
        //     }
        // }

        // shouldUpdateLimitPrice && console.log('shouldUpdateLimitPrice')
        // console.log(`oldLimitPrice ${oldLimitPrice}, latest ${latest}, newLimitPrice ${newLimitPrice}`)

        // if (shouldUpdateLimitPrice) {
        //     let modifiedData = await modifyActiveOrder(
        //         Object.assign(
        //             {},
        //             { symbol: SYMBOL, orderId, orderPrice: newLimitPrice },
        //             !isStart && {
        //                 stop_loss: calcStopLossPrice({
        //                     isLong: isBuy,
        //                     price: latest,
        //                     pips: STOP_LOSS_PIPS,
        //                     decimals: DECIMALS,
        //                 }),
        //             }
        //         )
        //     )
        //     if (modifiedData?.ret_msg === 'OK') {
        //         console.log('modify active order success, new price')
        //     }
        // }

        await sleep(QUERY_ORDER_STATUS_INTERVAL)
        console.log(`waited ${i} of ${nWaitOrderFilled}`)
    }
    return false
}

export const addStopLoss = async ({ orderId, isBuy }: { orderId: string; isBuy: boolean }) => {
    let latest = await getLastPrice({ symbol: SYMBOL })

    let modifiedData = await modifyActiveOrder({
        symbol: SYMBOL,
        orderId: orderId,
        stopLoss: calcStopLossPrice({
            isLong: isBuy,
            price: latest,
            pips: STOP_LOSS_PIPS,
            decimals: DECIMALS,
        }),
    })
    if (modifiedData?.ret_msg !== 'OK') {
        console.log('modify active order with stop loss failure', modifiedData)
    } else {
        console.log('success adding stop loss')
    }
}

export const tillFillOrder = async ({
    isBuy,
    orderId,
    isStart,
}: {
    orderId: string
    isBuy: boolean
    isStart: boolean
}) => {
    let str = isStart ? 'open order' : 'close order'
    console.log(str, 'waiting to get filled')

    let isFilled = await waitOrderFilled({ orderId: orderId, isBuy: isBuy, isStart })

    if (isFilled) {
        console.log(str, 'filled successfully')
    } else {
        console.log(str, 'could not fill')
        console.log('cancelling')
        let cancelledData = await cancelActiveOrder({
            orderId: orderId,
            symbol: SYMBOL,
        })
        if (cancelledData?.ret_msg === 'OK') {
            console.log(str, 'cancelled successfully')
        }
    }

    return isFilled
}

const WAIT_ORDER_FINISHED_TIMEOUT = 190000

export const checkCloseLimit = async ({ orderId, isBuy }: { orderId: string; isBuy: boolean }) => {
    const nWaitOrderFinished = WAIT_ORDER_FINISHED_TIMEOUT / QUERY_ORDER_STATUS_INTERVAL

    let stopLossProcedure = false

    for (let i = 0; i < nWaitOrderFinished; i++) {
        let openOrderQueryData = await queryActiveOrder({ orderId, symbol: SYMBOL })
        let limitPrice = openOrderQueryData?.result.price

        let isFilled = openOrderQueryData?.result.order_status === 'Filled'
        if (isFilled) {
            console.log('close order filled')
            return
        }

        let latest = await getLastPrice({ symbol: SYMBOL })
        let newLimitPrice = calcEndLimitPrice({
            isLong: isBuy,
            price: latest,
            pips: TAKE_PROFIT_PIPS,
            decimals: DECIMALS,
        })

        let originalLimitFar = Math.abs(latest - limitPrice)
        let currentLimitFar = Math.abs(latest - newLimitPrice)
        console.log('currentCloseLimitFar', currentLimitFar)

        if (
            Math.abs(originalLimitFar - currentLimitFar) >
            priceFromPips({ decimals: DECIMALS, pips: STOP_LOSS_PIPS / 4 })
        ) {
            console.log(`stop loss procedure: limitPrice ${limitPrice}, latest ${latest}`)
            stopLossProcedure = true
            break
        }

        await sleep(QUERY_ORDER_STATUS_INTERVAL)
        console.log(`waited ${i} of ${nWaitOrderFinished}`)
    }

    if (!stopLossProcedure) {
        console.error('close order normal stage TIMEOUT')
    }
    return stopLossProcedure
}
