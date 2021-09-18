import { NextApiRequest, NextApiResponse } from 'next'

import promiseAny from 'promise.any'

promiseAny.shim()

export type Session = { id: string }

let isProd = process.env.NODE_ENV == 'production'
console.log('isProd', isProd)

type RouteHandler = (req: RequestContext, res: NextApiResponse) => Promise<any>

const wrapMiddleware =
    (mid: any) => (fn: RouteHandler) => async (req: RequestContext, res: NextApiResponse) => {
        await new Promise((resolve, reject) => {
            mid(req, res, async (result: any) => {
                if (result instanceof Error) {
                    return reject(result)
                }

                return resolve(result)
            })
        })
        return fn(req, res)
    }
export type RequestContext = NextApiRequest
// & { graphQLClient: typeof graphQLClient } & { opentok: typeof opentok }

const addContext = (fn: RouteHandler) => (req: RequestContext, res: NextApiResponse) => {
    // req.graphQLClient = graphQLClient
    return fn(req, res)
}

const handleError = (fn: RouteHandler) => (req: RequestContext, res: NextApiResponse) =>
    fn(req, res).catch(err => {
        console.log('err.message', err.message)
        console.log('err.status', err.status)
        res.status(err.status || 500).end(err.message || '')
    })

const handleResult = (fn: RouteHandler) => (req: RequestContext, res: NextApiResponse) =>
    fn(req, res).then(json => {
        res.status(200).json(json)
    })

export const wrapRoute = (fn: RouteHandler) => handleError(handleResult(addContext(fn)))
