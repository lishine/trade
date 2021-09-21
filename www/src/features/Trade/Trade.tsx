import { useHandler } from 'react-handler-hooks'
import { useEffect, useState } from 'react'
import { useLatest, useFirstMountState, useMountedState } from 'react-use'
import { sleep, runAndSubscribeFew, runAndSubscribeKey } from '~/utils'
import { RefLabel } from '~/features/Trade/components/RefLabel'
import { UI } from '~/features/Trade/components/UI'
import { derivedState, state } from '~/features/Trade/state/state'
import { getExchangeInfo, loadData, wsSubscribeCurrentPrice } from '~/features/Trade/state/dataActions'
import { dataState } from '~/features/Trade/state/state'

import { Chart } from '~/features/Trade/components/Chart'

export const Trade = () => {
    useEffect(() => {
        getExchangeInfo()
    }, [])
    // useEffect(
    //     () =>
    //         runAndSubscribeKey(state, 'symbol', () => {
    //             dataState.data = []
    //             wsSubscribeCurrentPrice()
    //             loadData()
    //         }),
    //     []
    // )

    // useEffect(
    //     () =>
    //         runAndSubscribeFew([[state, 'slicedDataLength'], [dataState.data]], () => {
    //             if (state.slicedDataLength > 20) {
    //                 dataState.slicedData = dataState.data.slice(state.slicedDataLength * -1)
    //             }
    //         }),
    //     []
    // )

    return (
        <div>
            <UI />
            <Chart />
        </div>
    )
}
