import { useHandler } from 'react-handler-hooks'
import { useEffect, useState } from 'react'
import { useLatest, useFirstMountState, useMountedState } from 'react-use'
import {
    VerticalGridLines,
    XYPlot,
    XAxis,
    YAxis,
    HorizontalGridLines,
    LineSeries,
    LineSeriesCanvas,
    LineMarkSeries,
    MarkSeries,
    LineMarkSeriesCanvas,
} from 'react-vis'

import { RefLabel } from '~/features/Trade/components/RefLabel'
import { subscribe, proxy, useSnapshot } from 'valtio'

import { derivedState, state } from '~/features/Trade/state/state'
// import { dataState } from '~/features/Trade/state/state'
import { events } from '~/features/Trade/state/events'
import dayjs from 'dayjs'

export const ChartReactVis = () => {
    // let dataSnap = useSnapshot(dataState)

    const Line = LineMarkSeries

    return (
        <div onWheel={(w) => events.onWheel(w.deltaY)}>
            {/* <XYPlot getX={(d: any) => d.time} getY={(d: any) => d.price} width={1900} height={880}>
                <Line
                    data={dataSnap.data as any[]}
                    size={3}
                    fill='blue'
                    // curve='curveLinear'
                />
                <XAxis
                    // tickValues={data.map((d) => d.timestamp)}
                    tickTotal={10}
                    tickFormat={(v) => {
                        return dayjs(v).format('mm')
                        // return dayjs(v).format('HH-mm-ss-sss')
                    }}

                    // tickTotal={100}
                />
                <YAxis width={70} tickTotal={10} />
            </XYPlot> */}
        </div>
    )
}
