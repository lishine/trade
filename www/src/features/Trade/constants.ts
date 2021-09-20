export type TTick = {
    timestamp: number
    time: string
    price: number
}

export let symbolData = {
    BTCUSDT: {
        decimals: 0,
    },
    SOLUSDT: {
        decimals: 3,
    },
    XRPUSDT: {
        decimals: 4,
    },
    LTCUSDT: {
        decimals: 2,
    },
    SCUSDT: {
        decimals: 5,
    },
    BALUSDT: {
        decimals: 2,
    },
    DGBUSDT: {
        decimals: 4,
    },
}
export type TSymbols = keyof typeof symbolData
