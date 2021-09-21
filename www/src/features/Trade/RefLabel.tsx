import { useMutation, useQuery } from 'react-query'
import { useHandler } from 'react-handler-hooks'
import { useEffect, useState } from 'react'
import { useLatest, useFirstMountState, useMountedState } from 'react-use'

export const RefLabel = (props: any) => {
    const { y } = props.viewBox
    return (
        <text x={'90%'} y={y} fill={props.color} dy={-4} fontSize={20} textAnchor='middle'>
            {props.label}
        </text>
    )
}
