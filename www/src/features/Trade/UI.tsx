import styles from '~/styles/home.module.scss'
import { useMutation, useQuery } from 'react-query'
import { useHandler } from 'react-handler-hooks'
import { useEffect, useState } from 'react'
import { useLatest, useFirstMountState, useMountedState } from 'react-use'

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
import { TTick } from '~/features/Trade/localConstants'

export const UI = (props: any) => {
    const [quantity, setQuantity] = useState(0.001)
    const [stopLossPips, setStopLossPips] = useState(20)
    const [takeProfitLimitPips, setTakeProfitLimitPips] = useState(10)
    const isFirstMount = useFirstMountState()

    const [refetchCnt, setRefetchCnt] = useState(0)
    const [prev, setPrev] = useState(0)
    const [latest, setLatest] = useState(0)

    const [interpolatedData, setInterpolatedData] = useState<TTick[][]>([[]])
    const [rawData, setRawData] = useState<TTick[]>([])

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
                <ButtonGroup variant='solid' size='lg' spacing='20'>
                    <Button
                        colorScheme='darkgreen'
                        onClick={() => {
                            props.placeOrder()
                        }}
                    >
                        Place Binance order
                    </Button>
                </ButtonGroup>
                <HStack spacing={20}>
                    <Text>LONG</Text>
                    <Switch
                        value={props.isLong}
                        size='lg'
                        onChange={(e) => props.onDirectionChange(!e.target.checked)}
                    />
                    <Text>SHORT</Text>
                </HStack>
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
