import { sleep } from '~/utils'
import { SYMBOL } from '~/pages/api/__/constants'
import { client } from '~/pages/api/__/client'

const WAIT_ORDER_FILLED_TIMEOUT = 19000000
const QUERY_ORDER_STATUS_INTERVAL = 1000

export const waitConditionalOrderFilled = async ({
    orderId,
    shouldBeCancelled,
}: {
    orderId: string
    shouldBeCancelled: () => boolean
}) => {
    const nWaitOrderFilled = WAIT_ORDER_FILLED_TIMEOUT / QUERY_ORDER_STATUS_INTERVAL
    for (let i = 0; i < nWaitOrderFilled; i++) {
        let openOrderQueryData: any
        openOrderQueryData = await client.queryConditionalOrder({
            symbol: SYMBOL,
            stop_order_id: orderId,
        })

        if (shouldBeCancelled()) {
            console.log('order cancelled by user', openOrderQueryData)
            return undefined
        }

        let status = openOrderQueryData?.result.order_status
        console.log('status', status)
        let isFilled = status === 'Filled'
        let isCancelled = status === 'Cancelled'
        let isRejected = status === 'Rejected'
        let isDeactivated = status === 'Deactivated'
        if (isFilled) {
            return { orderId: openOrderQueryData?.result.stop_order_id }
        } else if (isCancelled) {
            console.log('order cancelled', openOrderQueryData)
            return undefined
        } else if (isRejected) {
            console.log('order rejected', openOrderQueryData)
            return undefined
        } else if (isDeactivated) {
            console.log('order deactivated', openOrderQueryData)
            return undefined
        }

        await sleep(QUERY_ORDER_STATUS_INTERVAL)
        console.log(`waited ${i} of ${nWaitOrderFilled}`)
    }
    return undefined
}

export const tillOneConditionalOrderFilled = async ({
    orderIdLong,
    orderIdShort,
}: {
    orderIdLong: string
    orderIdShort: string
}) => {
    console.log('waiting to get filled')
    let flagShouldBeCancelled = false

    flagShouldBeCancelled = false
    const shouldBeCancelled = () => {
        return flagShouldBeCancelled
    }

    let promise1 = waitConditionalOrderFilled({ orderId: orderIdLong, shouldBeCancelled })
    let promise2 = waitConditionalOrderFilled({ orderId: orderIdShort, shouldBeCancelled })
    let filled = await Promise.any([promise1, promise2])
    flagShouldBeCancelled = true

    if (filled) {
        let firstOrSecond = filled.orderId === orderIdLong ? 'LONG' : 'SHORT'
        console.log(`filled order ${firstOrSecond} successfully`)
        let idToBeLive = filled.orderId !== orderIdLong ? orderIdShort : orderIdLong
        let idToBeCancelled = filled.orderId === orderIdLong ? orderIdShort : orderIdLong

        let cancelledOrderData = await client.cancelConditionalOrder({
            symbol: SYMBOL,
            stop_order_id: idToBeCancelled,
        })

        if (cancelledOrderData?.ret_code === 0 && cancelledOrderData?.ext_code === '') {
            console.log(`cancelled successfuly conditional order ${firstOrSecond}`)
        }
        return { orderId: idToBeLive }
    } else {
        console.log('could not fill any')
        console.log('cancelling all conditional')
        let cancelledAllOrderData = await client.cancelAllConditionalOrders({
            symbol: SYMBOL,
        })
        if (cancelledAllOrderData?.ret_code === 0 && cancelledAllOrderData?.ext_code === '') {
            console.log('cancelled all conditional successfully', cancelledAllOrderData)
        } else {
            console.log('ERROR cancelling all conditional orders', cancelledAllOrderData)
        }
    }

    return undefined
}
