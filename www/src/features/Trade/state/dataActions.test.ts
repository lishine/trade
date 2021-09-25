import { AggregatedTrade } from 'binance-api-node'
import dayjs from 'dayjs'
import { dataState } from '~/features/Trade/state/dataState'
import { createTick } from '~/features/Trade/utils'
import { aggData } from './dataActions'

const testWsAdditionToTheRight = () => {
    let _ws_data_len_ = 10
    let wsData = new Array(_ws_data_len_).fill(undefined).map((_, index) => {
        let trade = { timestamp: index, price: index, quantity: 0 }
        return createTick({ trade })
    })

    dataState.dataWs = wsData
    dataState.aggData.length = 0
    dataState.dataLevelsResidue = { left: [], right: [] }

    aggData({ dataKey: 'dataWs', isPrepend: false })

    console.log('--------------FIRST TIME----------------')
    console.log('aggData', dataState.aggData)
    console.log('dataState.dataLevelsResidue', JSON.stringify(dataState.dataLevelsResidue, null, 2))
    console.log('dataState.dataWs', dataState.dataWs)
    console.log('-----END------FIRST TIME----------------')

    wsData = wsData.map((d) => ({ ...d, time: d.time + _ws_data_len_, price: d.price + _ws_data_len_ }))
    dataState.dataWs = wsData
    aggData({ dataKey: 'dataWs', isPrepend: false })

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

    dataState.aggData.length = 0
    dataState.dataLevelsResidue = { left: [], right: [] }

    console.log('--------------FIRST TIME----------------')

    dataState.data = data
    aggData({ dataKey: 'data', isPrepend: true })

    console.log('aggData', dataState.aggData)
    console.log('dataState.dataLevelsResidue', JSON.stringify(dataState.dataLevelsResidue, null, 2))
    console.log('dataState.data', dataState.data)
    console.log('-----END------FIRST TIME----------------')

    console.log('-----START----SECOND TIME----------------')

    data = data.map((d) => ({ ...d, time: d.time - _data_len_, price: d.price - _data_len_ }))
    dataState.data = data
    aggData({ dataKey: 'data', isPrepend: true })

    console.log('aggData', dataState.aggData)
    console.log('dataState.dataLevelsResidue', JSON.stringify(dataState.dataLevelsResidue, null, 2))
    console.log('dataState.data', dataState.data)
    console.log('-----END------SECOND TIME----------------')
}

test('aggdata', () => {
    testPastDataAdditionToTheLeft()
})
