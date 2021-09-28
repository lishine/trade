import { unzipSync, strFromU8 } from 'fflate'
import Papa from 'papaparse'

export const readZip = async <T>({ symbol }: { symbol: string }) => {
    const massiveFileBuf = await fetch(
        // `https://data.binance.vision/data/futures/um/daily/aggTrades/${symbol}/1000SHIBUSDT-aggTrades-2021-09-25.zip`
        'https://data.binance.vision/data/futures/um/monthly/aggTrades/AAVEUSDT/AAVEUSDT-aggTrades-2021-08.zip'
    ).then((res) => res.arrayBuffer())

    const massiveFile = new Uint8Array(massiveFileBuf)
    let result = unzipSync(massiveFile)
    let str = strFromU8(Object.values(result)[0])
    return str
    // let { data, errors } = Papa.parse(str, { dynamicTyping: true, preview: 0 })
// 
    // return { data, errors }
}

// { isFuture: boolean; futureType:'coin'|'usd', isMonthly:boolean, symbol:string }
