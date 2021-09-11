import { LinearClient } from 'bybit-api'

const API_KEY = 'DGbm4b3GusCK3K28rf'
const PRIVATE_KEY = 'W8s7LgbDmsv6Hf2VRRXCPc7OM9XhUZnYJ44p'
const useLivenet = true

export const client = new LinearClient(API_KEY, PRIVATE_KEY, useLivenet)

export const getLastPrice = async ({ symbol }: { symbol: string }) => {
    let d = await client.getTickers({ symbol }).catch(err => {
        console.error(err)
    })
    let latest = +d.result[0].last_price
    console.log(`latest ${latest}`)

    return latest
}

export const queryActiveOrder = async ({ symbol, orderId }: { orderId: string; symbol: string }) => {
    let data = await client.queryActiveOrder({ symbol, order_id: orderId }).catch(err => {
        console.error(err)
    })
    return data
}

export const cancelActiveOrder = async ({ symbol, orderId }: { orderId: string; symbol: string }) => {
    let data = await client.cancelActiveOrder({ symbol, order_id: orderId }).catch(err => {
        console.error(err)
    })
    return data
}

export const modifyActiveOrder = async ({
    symbol,
    orderId,
    orderPrice,
}: {
    orderId: string
    symbol: string
    orderPrice: number
}) => {
    let data = await client
        .replaceActiveOrder({ symbol, order_id: orderId, p_r_price: orderPrice })
        .catch(err => {
            console.error(err)
        })
    return data
}


// take_profit: priceAddPercent({
//     price: latest,
//     percent: TAKE_PROFIT_PERCENT,
//     isPlus: _isBuy,
//     decimals: DECIMALS,
// }),
