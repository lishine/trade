import Binance, { ReconnectingWebSocketHandler, AggregatedTrade } from 'binance-api-node'
import dayjs from 'dayjs'
import { TTick } from '~/features/Trade/localConstants'

// {
//     timestamp: string | number
//     price: string | number
// }
export const createTick = ({ trade }: { trade: AggregatedTrade }) => {
    let time = +trade.timestamp
    let price = +trade.price
    let quantity = +trade.quantity
    return { time, quantity, price: price } as TTick
}

export const bClient = Binance()
