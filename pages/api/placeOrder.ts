// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { cancelActiveOrder, client, getLastPrice, queryActiveOrder } from './__/client'
import { RequestContext, wrapRoute } from './__/common'
import { IS_START_LIMIT, SYMBOL } from './__/constants'
import { sendOrder } from './__/sendOrder'
import { ApiHelloResult } from './__/types'
import { waitForOrderFilled } from './__/adjustLimits'

const placeOrder = async (req: RequestContext, res: NextApiResponse) => {
    console.log('placing order')

    let isBuy = !!req.body.buy

    let openOrderData = await sendOrder({ isBuy, isOpen: true })

    if (openOrderData.ret_msg === 'OK') {
        let isFilled = false
        if (IS_START_LIMIT) {
            console.log('waiting to get filled')
            try {
                isFilled = await waitForOrderFilled({ orderId: openOrderData.result.order_id, isBuy })
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
            await sendOrder({ isBuy, isClose: true })
        }
    }

    let ret = {}
    return ret as ApiHelloResult
}

export default wrapRoute(placeOrder)
