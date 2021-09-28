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
// import { placeOrder } from '~/features/Trade/state/serverActions'
import { SymbolSelector } from '~/features/Trade/components/SymbolSelector'
import { getHoursLoaded } from '~/features/Trade/state/dataState'

export const UI = () => {
    let snap = useSnapshot(state)

    return (
        <div>
            {/* <ButtonGroup variant='solid' size='lg' spacing='20'>
                        <Button
                        colorScheme='darkred'
                        onClick={async () => {
                            let data = await wretch('/api/getStatus').post().json()
                        }}
                        >
                        Get Status
                        </Button>
                    </ButtonGroup> */}
            <HStack spacing={100} w='full' justify='center' mt={6} mb={12}>
                <SymbolSelector />
                <ButtonGroup variant='solid' size='lg' spacing='20'>
                    <Button
                        colorScheme='darkgreen'
                        onClick={() => {
                            state.isLong = true
                            // placeOrder()
                        }}
                    >
                        Long
                    </Button>
                    <Button
                        colorScheme='darkred'
                        onClick={() => {
                            state.isLong = false
                            // placeOrder()
                        }}
                    >
                        Short
                    </Button>
                </ButtonGroup>
                <HStack spacing={20}>
                    <Text>LONG</Text>
                    <Switch
                        value={snap.isLong ? 'long' : ''}
                        size='lg'
                        onChange={(e) => {
                            state.isLong = !e.target.checked
                        }}
                    />
                    <Text>SHORT</Text>
                </HStack>
                <div>Hours loaded: {getHoursLoaded({ symbol: snap.symbol })}</div>
            </HStack>
            {/* <Button
                            colorScheme='darkred'
                            onClick={async () => {
                                let data = await wretch('/api/testStartLimit')
                                    .post({
                                        isLong: false,
                                        symbol: symbol,
                                        decimals: symbolData[symbol].decimals,
                                        quantity: quantity,
                                    })
                                    .json()
                                console.table(data)
                            }}
                        >
                            Short - test start limit
                        </Button> */}
            {/* <ButtonGroup variant='solid' size='lg' spacing='20'>
                        <Button
                            colorScheme='darkgreen'
                            onClick={() =>
                                wretch('/api/simple').post({
                                    isLong: true,
                                    symbol: symbol,
                                    decimals: symbolData[symbol].decimals,
                                    quantity: quantity,
                                    stopLossPips: stopLossPips,
                                    takeProfitLimitPips: takeProfitLimitPips,
                                })
                            }
                        >
                            Long
                        </Button>
                        <Button
                            colorScheme='darkred'
                            onClick={() =>
                                wretch('/api/simple').post({
                                    isLong: false,
                                    symbol: symbol,
                                    decimals: symbolData[symbol].decimals,
                                    quantity: quantity,
                                    stopLossPips: stopLossPips,
                                    takeProfitLimitPips: takeProfitLimitPips,
                                })
                            }
                        >
                            Short
                        </Button>
                    </ButtonGroup> */}
            {/* <HStack>
                        <FormControl id='form1'>
                            <FormLabel>Symbol</FormLabel>
                            <Select
                                defaultValue={symbol}
                                placeholder='Select symbol'
                                onChange={(e) => {
                                    setSymbol(e.target.value as TSymbols)
                                }}
                            >
                                <option>BTCUSDT</option>
                                <option>SOLUSDT</option>
                                <option>XRPUSDT</option>
                                <option>LTCUSDT</option>
                            </Select>
                        </FormControl>
                        <FormControl id='form2'>
                            <FormLabel>Quantity</FormLabel>
                            <Input
                                type='text'
                                defaultValue={quantity}
                                onChange={(e) => {
                                    setQuantity(+e.target.value)
                                }}
                            />
                        </FormControl>
                        <FormControl id='form3'>
                            <FormLabel>Stop Loss (pips)</FormLabel>
                            <Input
                                value={stopLossPips}
                                onChange={(e) => {
                                    setStopLossPips(+e.target.value)
                                }}
                            />
                        </FormControl>
                    </HStack> */}
            {/* </VStack> */}
        </div>
    )
}

{
    /* <footer className={styles.footer}>
                <div>
                    <div>{new Array(refetchCnt).fill('*').join('')}</div>
                    {latest && (
                        <div>
                            latest: {latest}
                            {prev && <span> {latest > prev ? ' UP' : ' DOWN'}</span>}
                        </div>
                    )}
                </div>
            </footer> */
}
