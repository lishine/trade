import { priceAddPercent, sleep } from '../../../utils'
import { DECIMALS, PRICE_LIMIT_START_PERCENT, SYMBOL } from './constants'
import { getLastPrice, modifyActiveOrder, queryActiveOrder } from './client'

const WAIT_ORDER_FILLED_TIMEOUT = 30000
const QUERY_ORDER_STATUS_INTERVAL = 1000
const nWaits = WAIT_ORDER_FILLED_TIMEOUT / QUERY_ORDER_STATUS_INTERVAL

export const waitForOrderFilled = async ({ orderId, isBuy }: { orderId: string; isBuy: boolean }) => {
    for (let i = 0; i < nWaits; i++) {
        let openOrderQueryData: any
        try {
            openOrderQueryData = await queryActiveOrder({ orderId, symbol: SYMBOL })
        } catch (error) {
            console.log('error', error)
            break
        }
        let isFilled = openOrderQueryData?.result.order_status === 'Filled'
        if (isFilled) {
            return true
        }

        let oldLimitPrice = openOrderQueryData?.result.price
        let latest = await getLastPrice({ symbol: SYMBOL })
        let newLimitPrice = priceAddPercent({
            price: latest,
            percent: PRICE_LIMIT_START_PERCENT,
            isPlus: !isBuy,
            decimals: DECIMALS,
        })

        let shouldUpdateLimitPrice = false
        if (latest !== oldLimitPrice) {
            if (isBuy ? latest > oldLimitPrice : latest < oldLimitPrice) {
                shouldUpdateLimitPrice = newLimitPrice !== oldLimitPrice
            } else {
                shouldUpdateLimitPrice = true
            }
        }

        shouldUpdateLimitPrice && console.log('shouldUpdateLimitPrice')
        console.log(`oldLimitPrice ${oldLimitPrice}, latest ${latest}, newLimitPrice ${newLimitPrice}`)

        if (shouldUpdateLimitPrice) {
            let modifiedData = await modifyActiveOrder({ symbol: SYMBOL, orderId, orderPrice: newLimitPrice })
            if (modifiedData?.ret_msg === 'OK') {
                console.log('modify active order success, new price')
            }
        }

        await sleep(QUERY_ORDER_STATUS_INTERVAL)
        console.log(`waited ${i} of ${nWaits}`)
    }
    throw Error('could not fill')
}

export const adjustCloseOrderLimit = async ({ orderId, isBuy }: { orderId: string; isBuy: boolean }) => {
    for (let i = 0; i < nWaits; i++) {
        let openOrderQueryData: any
        try {
            openOrderQueryData = await queryActiveOrder({ orderId, symbol: SYMBOL })
        } catch (error) {
            console.log('error', error)
            break
        }
        let isFilled = openOrderQueryData?.result.order_status === 'Filled'
        if (isFilled) {
            return true
        }

        let oldLimitPrice = openOrderQueryData?.result.price
        let latest = await getLastPrice({ symbol: SYMBOL })
        let newLimitPrice = priceAddPercent({
            price: latest,
            percent: PRICE_LIMIT_START_PERCENT,
            isPlus: !isBuy,
            decimals: DECIMALS,
        })

        let shouldUpdateLimitPrice = false
        if (isBuy ? latest > oldLimitPrice : latest < oldLimitPrice) {
            console.log('new percent', (100 * Math.abs(newLimitPrice - oldLimitPrice)) / oldLimitPrice)
            console.log('factored old percent', PRICE_LIMIT_START_PERCENT)
            shouldUpdateLimitPrice =
                (100 * Math.abs(newLimitPrice - oldLimitPrice)) / oldLimitPrice > PRICE_LIMIT_START_PERCENT
        } else {
            shouldUpdateLimitPrice = true
        }

        shouldUpdateLimitPrice && console.log('shouldUpdateLimitPrice')

        if (shouldUpdateLimitPrice) {
            console.log(`oldLimitPrice ${oldLimitPrice}, latest ${latest}, newLimitPrice ${newLimitPrice}`)
            let modifiedData = await modifyActiveOrder({ symbol: SYMBOL, orderId, orderPrice: newLimitPrice })
            if (modifiedData?.ret_msg === 'OK') {
                console.log('modify active order success, new price')
            }
        }

        await sleep(QUERY_ORDER_STATUS_INTERVAL)
        console.log(`waited ${i} of ${nWaits}`)
    }
    throw Error('could not fill')
}
