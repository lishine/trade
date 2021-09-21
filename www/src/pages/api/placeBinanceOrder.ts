// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { RequestContext, wrapRoute } from './__/common'
import { IS_START_LIMIT, SYMBOL } from './__/constants'
import { ApiHelloResult } from './__/types'
import { addStopLoss, checkCloseLimit, tillFillOrder, waitOrderFilled } from './__/adjustLimits'
import { sendCloseOrder, sendOpenOrder } from './__/sendOrder'
import { autolimitmove } from '~/pages/api/__/strategies/autolimitmove'
import { fromrest } from '~/pages/api/__/strategies/fromrest/fromrest'
import { bClient } from './__/binanceClient'
import { NewFuturesOrder } from 'binance-api-node'

const placeBinanceOrder = async (req: RequestContext, res: NextApiResponse) => {
    let { symbol, quantity, isLong, exitPrice, stopLossPrice } = req.body

    let _quantity = quantity.toFixed(0)

    let openParams: NewFuturesOrder = {
        symbol: symbol,
        side: isLong ? 'BUY' : 'SELL',
        quantity: _quantity,
        type: 'MARKET',
        newOrderRespType: 'RESULT',
    }

    console.log('openParams', openParams)
    let res1 = await bClient.futuresOrder(openParams)
    console.log('res1', res1)

    let stopLossParams: NewFuturesOrder = {
        symbol: symbol,
        side: !isLong ? 'BUY' : 'SELL',
        type: 'STOP_MARKET',
        timeInForce: 'GTC',
        newOrderRespType: 'RESULT',
        // reduceOnly: 'true',
        stopPrice: stopLossPrice,
        // quantity: _quantity,
        closePosition: 'true',
    }

    console.log('stopLossParams', stopLossParams)
    let res1_1 = await bClient.futuresOrder(stopLossParams)
    console.log('res1_1', res1_1)

    let closeParams: NewFuturesOrder = {
        symbol: symbol,
        side: !isLong ? 'BUY' : 'SELL',
        type: 'LIMIT',
        reduceOnly: 'true',
        timeInForce: 'GTC',
        newOrderRespType: 'RESULT',
        price: exitPrice,
        quantity: _quantity,
    }

    console.log('closeParams', closeParams)
    let res2 = await bClient.futuresOrder(closeParams)
    console.log('res2', res2)
}
export default wrapRoute(placeBinanceOrder)
