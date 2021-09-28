import { AggregatedTrade, ReconnectingWebSocketHandler } from 'binance-api-node'
import { proxy } from 'valtio'
import { symbols, TTick } from '~/features/Trade/localConstants'
import { state } from '~/features/Trade/state/state'
import { bClient, createTick } from '~/features/Trade/utils'
import { JSONstringify, sleep, waitForStateOnce } from '~/utils'
import { dataState, getHoursLoaded, TDataLevelsResidue } from '~/features/Trade/state/dataState'

let cnt = 0
export const wsSubscribeCurrentPrice = () => {
    let trades = dataState.trades[state.symbol]
    if (!trades) {
        return
    }
    console.log('wsSubscribeCurrentPrice')
    trades.dataWs.length = 0
    let symbol = state.symbol
    return bClient.ws.futuresAggTrades(symbol, (trade) => {
        if (cnt++ > 0) {
            return
        }
        console.log('ws received')
        let d = createTick({ trade })

        if (!trades) {
            return
        }

        trades.dataWs.push(d)
        state.lastPrice = d.price
    })
}

export const loadData = () => {
    let symbol = state.symbol
    let trades = dataState.trades[state.symbol]
    if (!trades) {
        return
    }

    console.log('loading past trades for', symbol)
    waitForStateOnce([trades.aggData], async () => {
        if (!trades) {
            return
        }
        trades.pastData.length = 0
        for (let index = 0; index < 2; index++) {
            console.log('4', index)
            if (state.symbol !== symbol) {
                break
            }
            let aggTrades: AggregatedTrade[] = []
            aggTrades = await bClient.futuresAggTrades({
                symbol: symbol,
                endTime: trades.aggData[0][0].time - 1,
                limit: 1000,
            })
            let mappedTrades = aggTrades.map((t) => createTick({ trade: t }))
            console.log('5', index)
            trades.pastData.length = 0
            trades.pastData.unshift(...mappedTrades)
            console.log('1', index)
            if (getHoursLoaded({ symbol: symbol }) > 24) {
                break
            }
            // await sleep(300)
        }
    })
}
