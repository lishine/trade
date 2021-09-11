import type { NextApiRequest, NextApiResponse } from 'next'
import { SYMBOL } from './__/constants'
import { client } from './__/client'
import { RequestContext, wrapRoute } from './__/common'
import { ApiHelloResult } from './__/types'

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
