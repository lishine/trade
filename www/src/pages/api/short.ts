// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { RequestContext, wrapRoute } from './__/common'

const short = async (req: RequestContext, res: NextApiResponse) => {
    console.log('req.body', req.body)
    // return sendSimpleOrder(req.body)
}
export default wrapRoute(short)
