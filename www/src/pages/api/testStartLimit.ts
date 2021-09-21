// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { cancelActiveOrder, check, client, getLastPrice, queryActiveOrder } from '~/pages/api/__/client'
import { calcStartLimitPrice } from '~/pages/api/__/constants'
import { sendSimpleOrder } from '~/pages/api/__/simple/sendSimpleOrder'
import { sleep } from '~/utils'
import { RequestContext, wrapRoute } from './__/common'

const putLimitOrder = async ({
    latest,
    isLong,
    price,
    symbol,
    decimals,
    quantity,
}: {
    symbol: string
    decimals: number
    quantity: number
    price: number
    latest: number
    isLong: boolean
}) => {
    let orderParams: Parameters<typeof client.placeActiveOrder>[0] = {
        side: isLong ? 'Buy' : 'Sell',
        symbol: symbol,
        order_type: 'Limit',
        qty: quantity,
        time_in_force: 'PostOnly',
        close_on_trigger: false,
        reduce_only: false,
        price: price,
    }

    let openOrderData = await client.placeActiveOrder(orderParams)
    if (check(openOrderData)) {
        console.log('GOOD, opened order')
        let openOrderId = openOrderData.result.order_id
        return openOrderId
    } else {
        console.log('open order params', orderParams)
        console.log('opend order data', openOrderData)
        console.log('ERROR opening placing')
        return undefined
    }
}

const testStartLimit = async (req: RequestContext, res: NextApiResponse) => {
    let { symbol, decimals, quantity, isLong } = req.body

    let latest = await getLastPrice({ symbol: symbol })

    let limits = [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    let results: string[] = []

    let promises: Promise<void>[] = []

    for (let index = 0; index < limits.length; index++) {
        let price = calcStartLimitPrice({
            isBuy: isLong,
            price: latest,
            pips: limits[index] * (isLong ? -1 : 1),
            decimals: decimals,
        })
        console.log('price', price)

        let createPromise = async () => {
            let orderId = await putLimitOrder({
                symbol,
                decimals,
                quantity,
                latest,
                isLong,
                price,
            })

            if (!orderId) {
                results[index] = 'not put'
                return
            }
            await sleep(10000)
            let queryData = await queryActiveOrder({ orderId, symbol: symbol })
            let status = queryData?.result.order_status
            results[index] = status
            console.log('status', index, status)

            await cancelActiveOrder({
                orderId: orderId,
                symbol: symbol,
            })
            console.log('controlled cancelled')
        }
        promises.push(createPromise())
        await sleep(100)
    }

    console.log('1')
    await Promise.all(promises)

    console.log('2')
    return { limits, results }
}

export default wrapRoute(testStartLimit)
