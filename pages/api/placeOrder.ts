// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { priceAddPercent, sleep } from '../../utils'
import { client } from './__client'
import { RequestContext, wrapRoute } from './__common'

export type ApiHelloResult = Record<string, any>

const getLastPrice = async ({ symbol }: { symbol: string }) => {
    let d = await client.getTickers({ symbol }).catch(err => {
        console.error(err)
    })
    return d.result[0].last_price
}

const queryActiveOrder = async ({ symbol, orderId }: { orderId: string; symbol: string }) => {
    let data = await client.queryActiveOrder({ symbol, order_id: orderId }).catch(err => {
        console.error(err)
    })
    return data
}

const cancelActiveOrder = async ({ symbol, orderId }: { orderId: string; symbol: string }) => {
    let data = await client.cancelActiveOrder({ symbol, order_id: orderId }).catch(err => {
        console.error(err)
    })
    return data
}

export const SYMBOL = 'XRPUSDT'

const TAKER_FEE = 0.075
const MAKER_FEE = 0.025

const PRICE_LIMIT_START_PERCENT = 0.01
const STOP_LOSS_PERCENT = 1
const TAKE_PROFIT_PERCENT = 0.01
const DECIMALS = 4

const IS_START_LIMIT = true

const sendOrder = async ({
    isBuy,
    latest,
    isOpen,
    isClose,
}: {
    latest: number
    isBuy: boolean
    isOpen?: boolean
    isClose?: boolean
}) => {
    if (!isOpen && !isClose) {
        throw Error('_placeOrder: must provide either close or open true')
    }
    let _isStartLimit = IS_START_LIMIT || isClose
    let _isBuy = isOpen ? isBuy : !isBuy

    let common = {
        symbol: SYMBOL,
        order_type: _isStartLimit ? 'Limit' : 'Market',
        qty: 100,
        time_in_force: _isStartLimit ? 'PostOnly' : 'GoodTillCancel',
        close_on_trigger: !!isClose,
        reduce_only: !!isClose,
    }

    let placeOrderParams = Object.assign(
        {},
        common,
        { side: _isBuy ? 'Buy' : 'Sell' },
        isOpen && {
            stop_loss: priceAddPercent({
                price: latest,
                percent: STOP_LOSS_PERCENT,
                isPlus: !_isBuy,
                decimals: DECIMALS,
            }),
            // take_profit: priceAddPercent({
            //     price: latest,
            //     percent: TAKE_PROFIT_PERCENT,
            //     isPlus: _isBuy,
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

const WAIT_ORDER_FILLED_TIMEOUT = 10000
const QUERY_ORDER_STATUS_INTERVAL = 1000

const waitForOrderFilled = async ({ orderId }: { orderId: string }) => {
    for (let i = 0; i < WAIT_ORDER_FILLED_TIMEOUT / QUERY_ORDER_STATUS_INTERVAL; i++) {
        let openOrderQueryData: any
        try {
            openOrderQueryData = await queryActiveOrder({ orderId, symbol: SYMBOL })
        } catch (error) {
            console.log('error', error)
            break
        }
        let openOrderStatus = openOrderQueryData?.result.order_status
        if (openOrderStatus === 'Filled') {
            return true
        }
        await sleep(QUERY_ORDER_STATUS_INTERVAL)
    }
    throw Error('could not fill')
}

const EXPORT_placeOrder = async (req: RequestContext, res: NextApiResponse) => {
    let latest = +(await getLastPrice({ symbol: SYMBOL }))
    console.log(`latest ${latest}`)

    let isBuy = !!req.body.buy

    console.log('opening order')
    let openOrderData = await sendOrder({ isBuy, latest, isOpen: true })

    if (openOrderData.ret_msg === 'OK') {
        let isFilled = false
        if (IS_START_LIMIT) {
            console.log('waiting to get filled')
            try {
                isFilled = await waitForOrderFilled({ orderId: openOrderData.result.order_id })
            } catch (error) {
                console.log('could not fill')
                console.log('cancelling')
                let cancelledData = await cancelActiveOrder({
                    orderId: openOrderData.result.order_id,
                    symbol: SYMBOL,
                })
                if (cancelledData?.ret_msg === 'OK') {
                    console.log('cancelled successfully')
                }
            }
            if (isFilled) {
                console.log('filled successfully')
            }
        } else {
            isFilled = true
        }
        if (isFilled) {
            console.log('closing order')
            let latest1 = +(await getLastPrice({ symbol: SYMBOL }))
            console.log(`latest: ${latest} , latest1: ${latest1}`)
            await sendOrder({ isBuy, latest: latest1, isClose: true })
        }
    }

    let ret = {}
    return ret as ApiHelloResult
}

export default wrapRoute(EXPORT_placeOrder)
