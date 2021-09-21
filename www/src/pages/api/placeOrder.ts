// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { RequestContext, wrapRoute } from './__/common'
import { IS_START_LIMIT, SYMBOL } from './__/constants'
import { ApiHelloResult } from './__/types'
import { addStopLoss, checkCloseLimit, tillFillOrder, waitOrderFilled } from './__/adjustLimits'
import { sendCloseOrder, sendOpenOrder } from './__/sendOrder'
import { autolimitmove } from '~/pages/api/__/strategies/autolimitmove'
import { fromrest } from '~/pages/api/__/strategies/fromrest/fromrest'

const placeOrder = async (req: RequestContext, res: NextApiResponse) => {
    let strategy = req.body.strategy
    if (strategy === 'autolimitmove') {
        await autolimitmove({ isBuy: !!req.body.buy })
    } else if (strategy === 'fromrest') {
        fromrest()
    }
}
export default wrapRoute(placeOrder)
