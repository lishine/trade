import { AggregatedTrade, ReconnectingWebSocketHandler } from 'binance-api-node'
import { proxy } from 'valtio'
import { symbols, TTick } from '~/features/Trade/localConstants'
import { state } from '~/features/Trade/state/state'
import { bClient, createTick } from '~/features/Trade/utils'
import { JSONstringify, sleep, waitForStateOnce } from '~/utils'
import { dataState, derivedDataState, TDataLevelsResidue } from '~/features/Trade/state/dataState'

let clean: ReconnectingWebSocketHandler | undefined
export const wsSubscribeCurrentPrice = () => {
    dataState.dataWs.length = 0
    clean?.()
    clean = bClient.ws.futuresAggTrades([state.symbol], (trade) => {
        let d = createTick({ trade })
        dataState.dataWs.push(d)
        state.lastPrice = d.price
    })
}

export const loadData = () => {
    waitForStateOnce([dataState.aggData], async () => {
        dataState.pastData.length = 0
        for (let index = 0; index < 100; index++) {
            console.log('loading past trades', index)
            let aggTrades: AggregatedTrade[] = []
            aggTrades = await bClient.futuresAggTrades({
                symbol: state.symbol,
                endTime: dataState.aggData[0][0].time - 1,
                limit: 500,
            })
            let mappedTrades = aggTrades.map((t) => createTick({ trade: t }))

            dataState.pastData.unshift(...mappedTrades)
            if (derivedDataState.minutesLoaded > 100) {
                break
            }
            await sleep(100)
        }
    })
}
