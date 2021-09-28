import styles from '~/styles/home.module.scss'
import { useMutation, useQuery } from 'react-query'
import { useHandler } from 'react-handler-hooks'
import { useEffect, useState } from 'react'
import { useLatest, useFirstMountState, useMountedState } from 'react-use'
import { proxy, useSnapshot } from 'valtio'

import {
    Input,
    HStack,
    VStack,
    FormLabel,
    Select,
    FormControl,
    Button,
    ButtonGroup,
    useColorMode,
    Text,
    Switch,
} from '@chakra-ui/react'
import { state } from '~/features/Trade/state/state'
import { dataState } from '~/features/Trade/state/dataState'

export const SymbolSelector = () => {
    let dataStateSnap = useSnapshot(dataState)
    let stateSnap = useSnapshot(state)
    return (
        <div>
            <Select
                placeholder='Select symbol'
                size='lg'
                value={stateSnap.symbol}
                onChange={(e) => {
                    state.symbol = e.target.value
                }}
            >
                {Object.keys(dataStateSnap.symbols).map((s) => {
                    return (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    )
                })}
            </Select>
        </div>
    )
}
