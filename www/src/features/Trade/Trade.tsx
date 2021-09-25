import { useHandler } from 'react-handler-hooks'
import { useEffect, useState } from 'react'
import { useLatest, useFirstMountState, useMountedState, useInterval } from 'react-use'
import { sleep, runAndSubscribeFew, runAndSubscribeKey } from '~/utils'
import { RefLabel } from '~/features/Trade/components/RefLabel'
import { UI } from '~/features/Trade/components/UI'
import { derivedState, state } from '~/features/Trade/state/state'
import {
    doAggData,
    getExchangeInfo,
    loadData,
    wsSubscribeCurrentPrice,
} from '~/features/Trade/state/dataActions'

import { Chart } from '~/features/Trade/components/Chart'
import { ChartReactVis } from '~/features/Trade/components/ChartReactVis'
import { bClient, createTick } from '~/features/Trade/utils'
import { subscribe } from 'valtio'
import { subscribeKey } from 'valtio/utils'
import { dataState } from '~/features/Trade/state/dataState'

export const Trade = ({ isReactVis }: { isReactVis?: boolean }) => {
    useEffect(
        () =>
            runAndSubscribeKey(state, 'symbol', () => {
                wsSubscribeCurrentPrice()
                loadData()
            }),
        []
    )

    useEffect(
        () =>
            subscribe(dataState.pastData, () => {
                doAggData({
                    isPrepend: true,
                    addData: dataState.pastData,
                    aggData: dataState.aggData,
                    dataLevelsResidue: dataState.dataLevelsResidue,
                })
                dataState.pastData.length = 0
            }),
        []
    )
    useEffect(
        () =>
            subscribe(dataState.dataWs, () => {
                doAggData({
                    isPrepend: false,
                    addData: dataState.dataWs,
                    aggData: dataState.aggData,
                    dataLevelsResidue: dataState.dataLevelsResidue,
                })
                dataState.dataWs.length = 0
            }),
        []
    )

    return (
        <div>
            <UI />
            {isReactVis ? <ChartReactVis /> : <Chart />}
        </div>
    )
}
