import {
    AggregatedTrade,
    ReconnectingWebSocketHandler,
    SymbolLotSizeFilter,
    SymbolMinNotionalFilter,
    SymbolPriceFilter,
} from 'binance-api-node'
import { proxy } from 'valtio'
import { symbols, TTick } from '~/features/Trade/localConstants'
import { state } from '~/features/Trade/state/state'
import { bClient, createTick } from '~/features/Trade/utils'
import { JSONstringify, sleep, waitForStateOnce } from '~/utils'
import { sortBy, first, last, chunk, max, min } from 'lodash-es'
import { dataState, derivedDataState, TDataLevelsResidue } from '~/features/Trade/state/dataState'

let clean: ReconnectingWebSocketHandler | undefined
let cnt = 0
export const wsSubscribeCurrentPrice = () => {
    dataState.dataWs.length = 0
    clean?.()
    clean = bClient.ws.futuresAggTrades([state.symbol], (trade) => {
        // if (++cnt % 10 !== 0) {
        // return
        // }
        let d = createTick({ trade })
        dataState.dataWs.push(d)
        state.lastPrice = d.price
        // if (dataState.data.length > 100) {
        // dataState.data.shift()
        // }
        // if (dataState.dataWs[dataState.dataWs.length - 1].time - dataState.dataWs[0].time > 1000) {
        // dataState.dataWs.shift()
        // }
    })
}

export const getExchangeInfo = async () => {
    let eInfo = await bClient.exchangeInfo()
    // eInfo.symbols.forEach((symbol) => {
    //     let filters = symbol?.filters
    //     if (filters) {
    //         let minNotional = +(
    //             filters?.find((f) => f.filterType === 'MIN_NOTIONAL') as SymbolMinNotionalFilter
    //         )?.minNotional
    //         console.log(symbol.symbol, minNotional)
    //     }
    // })

    let prices = await bClient.futuresPrices()
    let obj: Record<string, any> = {}
    Object.keys(symbols).forEach((symbol) => {
        let filters = eInfo.symbols.find((s) => s.symbol === symbol)?.filters
        let tickSize = +(filters?.find((f) => f.filterType === 'PRICE_FILTER') as SymbolPriceFilter)?.tickSize
        let minPrice = +(filters?.find((f) => f.filterType === 'PRICE_FILTER') as SymbolPriceFilter)?.minPrice
        let quantityStepSize = +(filters?.find((f) => f.filterType === 'LOT_SIZE') as SymbolLotSizeFilter)
            ?.stepSize
        let minQuantity = +(filters?.find((f) => f.filterType === 'LOT_SIZE') as SymbolLotSizeFilter)?.minQty
        let minNotional = +(filters?.find((f) => f.filterType === 'MIN_NOTIONAL') as SymbolMinNotionalFilter)
            ?.minNotional
        let price = +prices[symbol]
        obj[symbol] = {
            price,
            minPrice,
            tickSize,
            quantityStepSize,
            minQuantity,
            minNotional,
        }
    })
    console.table(obj)
}

// function splitToChunks(array: any[], n: number) {
//     array = [...array]
//     return new Array(Math.ceil(array.length / n)).fill(undefined).map((_) => array.splice(0, n))
// }

function findMinMax(d: TTick[]) {
    let min = d[0].price
    let max = d[0].price
    let indMax = 0
    let indMin = 0
    d.forEach((t, i) => {
        if (t.price < min) {
            min = t.price
            indMin = i
        } else if (t.price > max) {
            max = t.price
            indMax = i
        }
    })
    return { min: d[indMin], max: d[indMax] }
}

const doAvg = ({ data, base }: { data: TTick[]; base: number }) => {
    let d: TTick[] = []
    let chunks = chunk(data, base)
    chunks.forEach((c) => {
        let prices = c.map((v) => v.price)
        let firstPrice = prices[0]
        let lastPrice = prices[prices.length - 1]
        let { min, max } = findMinMax(c)
        let choosen: TTick[] = []
        if (max.price >= firstPrice && max.price >= lastPrice) {
            choosen.push(max)
        }
        if (min.price <= firstPrice && min.price <= lastPrice) {
            choosen.push(min)
        }
        if (choosen.length === 0) {
            choosen.push(c[Math.round(base / 2)])
        }
        choosen = sortBy(choosen, 'time')
        d.push(...choosen)
    })
    return d
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

const base = 3
const _max_level_ = 100

// averaging done using n-base points from previous level, and saved to the next level
// data can be added from the left(past) or from the right(future - websockets)
// residue is saved for the next data
// isPast=true => prepend data
export const doAggData = ({
    isPrepend,
    addData,
    aggData,
    dataLevelsResidue,
}: {
    isPrepend: boolean
    addData: TTick[]
    aggData: TTick[][]
    dataLevelsResidue: TDataLevelsResidue
}) => {
    let dir: 'left' | 'right' = isPrepend ? 'left' : 'right'
    let shift: 'unshift' | 'push' = isPrepend ? 'unshift' : 'push'

    aggData[0] = aggData[0] ?? []

    aggData[0][shift](...addData)
    dataLevelsResidue[dir][0] = dataLevelsResidue[dir][0] ?? []
    dataLevelsResidue[dir][0][shift](...addData)

    for (let level = 1; level <= _max_level_; level++) {
        let newDataCount =
            dataLevelsResidue[dir][level - 1].length - (dataLevelsResidue[dir][level - 1].length % base)
        if (newDataCount === 0) {
            break
        }

        let newDataToProcess: TTick[]
        newDataToProcess = dataLevelsResidue[dir][level - 1].splice(dir === 'left' ? -newDataCount : 0, 0)
        let processedData = doAvg({ data: newDataToProcess, base })

        aggData[level] = aggData[level] ?? []
        aggData[level][shift](...processedData)

        dataLevelsResidue[dir][level] = dataLevelsResidue[dir][level] ?? []
        dataLevelsResidue[dir][level][shift](...processedData)
    }
}
