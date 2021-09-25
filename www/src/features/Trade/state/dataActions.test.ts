import { AggregatedTrade } from 'binance-api-node'
import dayjs from 'dayjs'
import { TTick } from '~/features/Trade/localConstants'
import { doAggData } from '~/features/Trade/state/aggUtils'
import { dataState, TDataLevelsResidue } from '~/features/Trade/state/dataState'
import { createTick } from '~/features/Trade/utils'

const testWsAdditionToTheRight = () => {
    let _ws_data_len_ = 10
    let data = new Array(_ws_data_len_).fill(undefined).map((_, index) => {
        let trade = { timestamp: index, price: index, quantity: 0 }
        return createTick({ trade })
    })

    let aggData: TTick[][] = []
    let dataLevelsResidue: TDataLevelsResidue = { left: [], right: [] }

    dataState.dataWs = data
    dataState.aggData.length = 0
    dataState.dataLevelsResidue = { left: [], right: [] }

    doAggData({ isPrepend: false, dataLevelsResidue, addData: data, aggData })

    console.log('--------------FIRST TIME----------------')
    console.log('aggData', dataState.aggData)
    console.log('dataState.dataLevelsResidue', JSON.stringify(dataState.dataLevelsResidue, null, 2))
    console.log('dataState.dataWs', dataState.dataWs)
    console.log('-----END------FIRST TIME----------------')

    data = data.map((d) => ({ ...d, time: d.time + _ws_data_len_, price: d.price + _ws_data_len_ }))
    dataState.dataWs = data
    doAggData({ isPrepend: false, dataLevelsResidue, addData: data, aggData })

    console.log('-----START----SECOND TIME----------------')
    console.log('aggData', dataState.aggData)
    console.log('dataState.dataLevelsResidue', JSON.stringify(dataState.dataLevelsResidue, null, 2))
    console.log('dataState.dataWs', dataState.dataWs)
    console.log('-----END------SECOND TIME----------------')
}

const testPastDataAdditionToTheLeft = () => {
    let _data_len_ = 10
    let data = new Array(_data_len_).fill(undefined).map((_, index) => {
        let trade = { timestamp: index + _data_len_, price: index + _data_len_, quantity: 0 }
        return createTick({ trade })
    })

    let aggData: TTick[][] = []
    let dataLevelsResidue: TDataLevelsResidue = { left: [], right: [] }

    console.log('--------------FIRST TIME----------------')

    doAggData({ isPrepend: true, dataLevelsResidue, addData: data, aggData })

    console.log('aggData', dataState.aggData)
    console.log('dataState.dataLevelsResidue', JSON.stringify(dataState.dataLevelsResidue, null, 2))
    console.log('dataState.data', dataState.pastData)
    console.log('-----END------FIRST TIME----------------')

    console.log('-----START----SECOND TIME----------------')

    data = data.map((d) => ({ ...d, time: d.time - _data_len_, price: d.price - _data_len_ }))
    doAggData({ isPrepend: true, dataLevelsResidue, addData: data, aggData })

    console.log('aggData', dataState.aggData)
    console.log('dataState.dataLevelsResidue', JSON.stringify(dataState.dataLevelsResidue, null, 2))
    console.log('dataState.data', dataState.pastData)
    console.log('-----END------SECOND TIME----------------')
}

test('aggdata', () => {
    testPastDataAdditionToTheLeft()
})
