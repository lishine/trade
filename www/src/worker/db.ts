import Dexie from 'dexie'

export class AppDatabase extends Dexie {
    trades!: Dexie.Table<TTrade, number>
    symbols!: Dexie.Table<Symbol, number>

    constructor() {
        super('TradesDatabase')

        var db = this

        db.version(1).stores({
            symbols: '++id, name, type, exchange, contractType, underlyingType',
            trades: '[time+id], symbolId, price, quantity, isBuyerTheMarketMaker',
        })

        db.symbols.mapToClass(Symbol)
    }
}

// 50344900, 0.00737, 69265, 106369315, 106369316, 1632528002837, false

export interface TTrade {
    id: number
    time: number
    symbolId: number
    price: number
    quantity: number
    isBuyerTheMarketMaker: boolean
}

type TExchange = 'binance'
type TSymbolType = 'spot' | 'futures'
type TContractType = 'perpetual'
type TUnderlyingType = 'coin' | 'usd'

export class Symbol {
    id!: number
    name!: string
    type!: TSymbolType
    exchange!: TExchange
    contractType!: TContractType
    underlyingType!: TUnderlyingType
    trades!: TTrade[]

    constructor(param: {
        name: string
        exchange: TExchange
        contractType: TContractType
        id?: number
        underlyingType: TUnderlyingType
        type: TSymbolType
    }) {
        this.name = param.name
        this.exchange = param.exchange
        this.contractType = param.contractType
        this.underlyingType = param.underlyingType
        this.type = param.type

        if (param.id) {
            this.id = param.id
        }
        Object.defineProperties(this, {
            trades: { value: [], enumerable: false, writable: true },
        })
    }

    async loadTrades() {
        ;[this.trades] = await Promise.all([db.trades.where('symbolId').equals(this.id).toArray()])
    }

    save() {
        console.log('save')
        return db.transaction('rw', db.symbols, db.trades, async () => {
            // console.log('0')
            this.id = await db.symbols.put(this)
            // console.log('1')
            // let [tradeIds] = await Promise.all([
            // Promise.all(this.trades.map((trade) => db.trades.put(trade))),
            // ])
            // console.log('2')
            // await Promise.all([
            //     db.trades
            //         .where('symbolId')
            //         .equals(this.id)
            //         .and((trade) => tradeIds.indexOf(trade.id) === -1)
            //         .delete(),
            // ])
        })
    }
    bulkPutTrades() {
        return db.trades.bulkPut(this.trades)
    }
}

export const db = new AppDatabase()
