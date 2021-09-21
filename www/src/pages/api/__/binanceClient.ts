import Binance from 'binance-api-node'

const APIKEY = 'zYyzmY3GOfxtdtqobknRvoIRQ1d0N15Ealfa9U29oB6rbY5PMpatJ38k6SypRDSm'
const APISECRET = 'U0uVOfRyG5VZFWCh9JpFXjMm1hF2exeKve5cm7CypeOK3vJGhimnZO4ng5WFrPg7'

export const bClient = Binance({
    apiKey: APIKEY,
    apiSecret: APISECRET,
})
