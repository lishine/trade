import { roughSizeOfObject } from '~/utils'
import { db, Symbol } from '~/worker/db'
import { readZip } from '~/worker/unzip'
import { testDb } from './d'

type TCsvFuturesTrade = {
    id: number
    price: number
    quantity: number
    firstTradeId: number
    lastTradeId: number
    time: number
    isBuyerTheMarketMaker: boolean
}

addEventListener('message', async (event) => {
    console.log('webworker start')

    // let symbol = new Symbol({
    //     name: '1000SHIBUSDT',
    //     exchange: 'binance',
    //     contractType: 'perpetual',
    //     type: 'futures',
    //     underlyingType: 'usd',
    // })

    let unzipped = await readZip({ symbol: '1000SHIBUSDT' })
    // let table = unzipped.data.map((d: any) => {
    //     return {
    //         id: d[0],
    //         price: d[1],
    //         quantity: d[2],
    //         firstTradeId: d[3],
    //         lastTradeId: d[4],
    //         time: d[5],
    //         isBuyerTheMarketMaker: d[6],
    //     } as TCsvFuturesTrade
    // })

    await testDb(unzipped)
    // console.log('table', JSON.stringify(table))

    // await symbol.save()
    // symbol.trades = table.slice(0, -1).map((t) => ({
    //     id: t.id,
    //     symbolId: symbol.id,
    //     time: t.time,
    //     price: t.price,
    //     quantity: t.quantity,
    //     isBuyerTheMarketMaker: t.isBuyerTheMarketMaker,
    // }))
    // await symbol.bulkPutTrades()
    // console.log('finished saving trades')
    // await symbol.loadTrades()
    // console.log('loading finished')
    // console.log('symbol trades', symbol.trades)
})

// console.log('size', roughSizeOfObject(unzipped.data))
