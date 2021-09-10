// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { SYMBOL } from './placeOrder'
import { client } from './__client'
import { RequestContext, wrapRoute } from './__common'

export type ApiHelloResult = Record<string, any>

const getLastPrice = async ({ symbol }: { symbol: string }) => {
    let d = await client.getTickers({ symbol }).catch(err => {
        console.error(err)
    })
    return d.result[0].last_price
}

const getStatus = async (req: RequestContext, res: NextApiResponse) => {
    let latest = await getLastPrice({ symbol: SYMBOL })
    let ret = { latest }

    return ret as ApiHelloResult
}

export default wrapRoute(getStatus)
