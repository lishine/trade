import Binance, { ReconnectingWebSocketHandler, AggregatedTrade } from 'binance-api-node'
import dayjs from 'dayjs'
import { TTick } from '~/features/Trade/constants'

export const createTick = ({ trade }: { trade: AggregatedTrade }) => {
    let timestamp = +trade.timestamp
    let time = dayjs(timestamp).format('mm')
    let price = +trade.price
    return { timestamp: timestamp, time: time, price: price } as TTick
}

export const bClient = Binance()
