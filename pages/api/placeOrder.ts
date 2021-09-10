// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { client } from './__client'
import { RequestContext, wrapRoute } from './__common'

export type ApiHelloResult = Record<string, any>

const getLastPrice = async ({ symbol }: { symbol: string }) => {
    let d = await client.getTickers({ symbol }).catch(err => {
        console.error(err)
    })
    return d.result[0].last_price
}

export const SYMBOL = 'XRPUSDT'

const priceAddPercent = ({ percent, isPlus, price }: { price: number; percent: number; isPlus: boolean }) => {
    return price + ((isPlus ? 1 : -1) * (price * percent)) / 100
}

const MARKET_FEE = 0.075

const placeOrder = async (req: RequestContext, res: NextApiResponse) => {
    let latest = await getLastPrice({ symbol: SYMBOL })
    return { latest }
    let isBuy = !!req.body.buy

    let common = {
        symbol: SYMBOL,
        order_type: 'Limit',
        qty: 100,
        time_in_force: 'GoodTillCancel',
        close_on_trigger: false,
        reduce_only: false,
    }

    let data = await client
        .placeActiveOrder(
            Object.assign({}, common, {
                price: priceAddPercent({ price: latest, percent: 0.05, isPlus: isBuy }),
                stop_loss: priceAddPercent({ price: latest, percent: 0.15, isPlus: isBuy }),
                take_profit: priceAddPercent({ price: latest, percent: MARKET_FEE * 2, isPlus: !isBuy }),
                side: isBuy ? 'Buy' : 'Sell',
            })
        )
        .catch(err => {
            console.error(err)
        })

    let ret = data

    return ret as ApiHelloResult
}

export default wrapRoute(placeOrder)

// let sendData = {}
// if (buy) {
//     sendData = Object.assign({}, common, {
//         price: priceFromPercent(latest, -0.05),
//         stop_loss: priceFromPercent(latest, -0.15),
//         take_profit: priceFromPercent(latest, MARKET_FEE * 2),
//         side: 'Buy',
//     })
// } else {
//     sendData = Object.assign({}, common, {
//         price: priceFromPercent(latest, -0.05),
//         stop_loss: priceFromPercent(latest, -0.15),
//         take_profit: priceFromPercent(latest, MARKET_FEE * 2),
//         side: 'Buy',
//     })
// }
