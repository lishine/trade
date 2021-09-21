import { useHandler } from 'react-handler-hooks'
import { useEffect, useState } from 'react'
import { useLatest, useFirstMountState, useMountedState } from 'react-use'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ReferenceLine } from 'recharts'

import { RefLabel } from '~/features/Trade/components/RefLabel'
import { subscribe, proxy, useSnapshot } from 'valtio'

import { derivedState, state } from '~/features/Trade/state/state'
import { dataState } from '~/features/Trade/state/state'
import { events } from '~/features/Trade/state/events'

export const Chart = () => {
    let snap = useSnapshot(state)
    let derivedSnap = useSnapshot(derivedState)
    let dataSnap = useSnapshot(dataState)

    return (
        <div onWheel={(w) => events.onWheel(w.deltaY)}>
            <LineChart width={1900} height={880} data={dataSnap.slicedData}>
                <ReferenceLine
                    y={snap.lastPrice}
                    label={<RefLabel color='green' label={snap.lastPrice} />}
                    color='green'
                    stroke='green'
                    strokeDasharray='3 3'
                />
                <ReferenceLine
                    alwaysShow
                    y={derivedSnap.exitPrice}
                    label={<RefLabel color='blue' label={derivedSnap.exitPrice} />}
                    stroke='blue'
                    strokeDasharray='3 3'
                />
                <ReferenceLine
                    alwaysShow
                    y={derivedSnap.stopLossPrice}
                    label={<RefLabel color='red' label={derivedSnap.stopLossPrice} />}
                    stroke='red'
                    strokeDasharray='3 3'
                />
                <Line
                    isAnimationActive={false}
                    type='monotone'
                    dataKey='price'
                    stroke='#2A62FF'
                    strokeWidth={1}
                    dot={false}
                    // dot={{ stroke: 'grey', strokeWidth: 1 }}
                />
                {/* <CartesianGrid stroke='#ccc' strokeDasharray='7 7' /> */}
                <XAxis
                    dataKey='time'
                    // tickCount={100}
                    minTickGap={100}
                />
                <YAxis
                    tickCount={10}
                    type='number'
                    domain={['dataMin', 'dataMax']}
                    padding={{
                        top: 0,
                        bottom: 20,
                    }}
                    width={100}
                    tickFormatter={(n: number) => n.toFixed(derivedState.decimals)}
                />
            </LineChart>
        </div>
    )
}
