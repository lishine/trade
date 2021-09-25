import Binance, { ReconnectingWebSocketHandler, AggregatedTrade } from 'binance-api-node'
import dayjs from 'dayjs'
import { TTick } from '~/features/Trade/localConstants'

type TTickInput =
    | {
          timestamp: string | number
          price: string | number
          quantity: string | number
      }
    | AggregatedTrade

// type TTickInput = {
//     timestamp: string | number
//     price: string | number
//     quantity: string | number
//     [index: string]: string | number
// }

export const createTick = ({ trade }: { trade: TTickInput }) => {
    let time = +trade.timestamp
    let price = +trade.price
    let quantity = +trade.quantity
    return { time, quantity, price: price } as TTick
}

export const bClient = Binance()
