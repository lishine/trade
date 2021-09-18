import { getLastPrice } from '~/pages/api/__/client'
import { DECIMALS, getPricePips, SYMBOL } from '~/pages/api/__/constants'
import { sleep } from '~/utils'
const WAIT_TIMEOUT = 190000000

const INTERVAL = 500

const REST_ENOUGH_S = 10
const MAX_DELTA = 1 * getPricePips({ decimals: DECIMALS })
const MIN_MOVES = 4

export const waitForRightMoment = async () => {
    const nCycles = WAIT_TIMEOUT / INTERVAL

    let pmin = 0
    let pmax = 0
    let nMoves = 0
    let prev = 0
    let cnt = 0

    let reset = () => {
        prev = 0
        pmin = 1000000
        pmax = 0
        nMoves = -1
        cnt = 0
    }
    reset()

    for (let i = 0; i < nCycles; i++) {
        let latest = await getLastPrice({ symbol: SYMBOL })

        if (latest !== prev) {
            prev = latest
            nMoves++
            if (latest > pmax) {
                pmax = latest
            }
            if (latest < pmin) {
                pmin = latest
            }
        }

        if (pmax - pmin > MAX_DELTA) {
            reset()
        }

        console.log(`latest ${latest} pmin ${pmin} pmax ${pmax} nMoves ${nMoves} cnt ${cnt}`)

        if (nMoves >= MIN_MOVES || cnt > (REST_ENOUGH_S * 1000) / INTERVAL) {
            return { pmin, pmax, latest }
        }

        cnt++
        await sleep(INTERVAL)
        console.log(`waitForRightMoment waited ${i} of ${nCycles}`)
    }

    return undefined
}
