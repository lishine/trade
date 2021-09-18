import {
    DECIMALS,
    calcEndLimitPrice,
    STOP_LOSS_PIPS,
    QUANTITY,
    SYMBOL,
    getPricePips,
    calcStopLossPrice,
} from '../../constants'
import { roundDecimals, sleep } from '~/utils'
import { waitForRightMoment } from '~/pages/api/__/strategies/fromrest/waitForRightMoment'
import { client, getLastPrice } from '~/pages/api/__/client'
import { tillOneConditionalOrderFilled } from '~/pages/api/__/strategies/fromrest/waitConditionalOrderFilled'

const WAIT_TIMEOUT = 190000000
const INTERVAL = 500

const N_FAR = 10

const LIMIT_TAKE_PROFIT = 60
const MARKET_TAKE_PROFIT = LIMIT_TAKE_PROFIT * 2
const STOP_LOSS = 3

export const fromrest = async () => {
    console.log('started fromrest')
    const nCycles = WAIT_TIMEOUT / INTERVAL

    let active = false
    for (let i = 0; i < 1; i++) {
        // let rightMoment = await waitForRightMoment()
        let rightMoment = true
        let latest = await getLastPrice({ symbol: SYMBOL })

        let { pmin, pmax } = { pmin: latest, pmax: latest }

        if (true || rightMoment) {
            active = true

            let upTriggerPrice = roundDecimals(pmax + getPricePips({ decimals: DECIMALS }) * N_FAR, DECIMALS)
            let downTriggerPrice = roundDecimals(
                pmin - getPricePips({ decimals: DECIMALS }) * N_FAR,
                DECIMALS
            )

            let longParams = {
                side: 'Buy',
                symbol: SYMBOL,
                qty: QUANTITY,
                base_price: latest,
                order_type: 'Market',
                stop_px: upTriggerPrice,
                close_on_trigger: false,
                reduce_only: false,
                time_in_force: 'GoodTillCancel',
                trigger_by: 'LastPrice',
                stop_loss: calcStopLossPrice({
                    isLong: true,
                    price: pmin,
                    pips: STOP_LOSS,
                    decimals: DECIMALS,
                }),
                take_profit: calcEndLimitPrice({
                    isLong: true,
                    price: latest,
                    pips: MARKET_TAKE_PROFIT,
                    decimals: DECIMALS,
                }),
            }
            let shortParams = {
                side: 'Sell',
                symbol: SYMBOL,
                qty: QUANTITY,
                base_price: latest,
                order_type: 'Market',
                stop_px: downTriggerPrice,
                close_on_trigger: false,
                reduce_only: false,
                time_in_force: 'GoodTillCancel',
                trigger_by: 'LastPrice',
                stop_loss: calcStopLossPrice({
                    isLong: false,
                    price: pmax,
                    pips: STOP_LOSS,
                    decimals: DECIMALS,
                }),
                take_profit: calcEndLimitPrice({
                    isLong: false,
                    price: latest,
                    pips: MARKET_TAKE_PROFIT,
                    decimals: DECIMALS,
                }),
            }
            let dataLong = await client.placeConditionalOrder(longParams)
            let dataShort = await client.placeConditionalOrder(shortParams)
            console.log('conditional order Long', dataLong)
            console.log('conditional order Short', dataShort)
            if (
                dataLong?.ret_code !== 0 ||
                dataLong?.ext_code !== '' ||
                dataShort?.ret_code !== 0 ||
                dataShort?.ext_code !== ''
            ) {
                console.log(
                    `ERROR placing conditional orders, longParams ${JSON.stringify(
                        longParams,
                        null,
                        2
                    )}, shortParams ${JSON.stringify(shortParams, null, 2)}`
                )
                return
            }

            let orderIdLong = dataLong?.result.stop_order_id
            let orderIdShort = dataShort?.result.stop_order_id
            let filled = await tillOneConditionalOrderFilled({ orderIdLong, orderIdShort })
            if (filled) {
                console.log('one conditional order filled, the other cancelled')

                let side: string
                if (filled.orderId === orderIdLong) {
                    side = 'Sell'
                } else {
                    side = 'Buy'
                }

                let closeParams = {
                    side: side,
                    symbol: SYMBOL,
                    order_type: 'Limit',
                    qty: QUANTITY,
                    time_in_force: 'PostOnly',
                    close_on_trigger: true,
                    price: calcEndLimitPrice({
                        isLong: !(side === 'Buy'),
                        price: latest,
                        pips: LIMIT_TAKE_PROFIT,
                        decimals: DECIMALS,
                    }),
                    reduce_only: true,
                }
                let closeOrderData = await client.placeActiveOrder(closeParams)
                if (closeOrderData?.ret_code === 0 && closeOrderData?.ext_code === '') {
                    console.log('dispatched close order', closeOrderData)
                } else {
                    console.log(
                        `ERROR dispatching close order, closeParams ${JSON.stringify(
                            closeParams,
                            null,
                            2
                        )}, closeOrderData ${JSON.stringify(closeOrderData, null, 2)}`
                    )
                }
            }
        }

        await sleep(INTERVAL)
        console.log(`fromrest waited ${i} of ${nCycles}`)
    }

    console.log('finished fromrest')
    return undefined
}
