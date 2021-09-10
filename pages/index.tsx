import type { NextPage } from 'next'
import Head from 'next/head'
import { useMutation, useQuery } from 'react-query'
import styles from '../styles/home.module.scss'
import wretch from 'wretch'
import { ApiHelloResult } from './api/getStatus'
import { useEffect, useState } from 'react'
import { JSONstringify } from '../utils'
import { useFirstMountState, useMountedState } from 'react-use'
import { useHandler } from 'react-handler-hooks'
import { Button, ButtonGroup, useColorMode } from '@chakra-ui/react'

const Home: NextPage = () => {
    // const { colorMode, toggleColorMode } = useColorMode()
    // console.log('colorMode', colorMode)
    const isFirstMount = useFirstMountState()

    let { data, isLoading, error } = useQuery<ApiHelloResult, string>(
        'hello',
        () => wretch('/api/getStatus').post().json(),
        { refetchInterval: 1000 }
    )

    const [refetchCnt, setRefetchCnt] = useState(0)
    const [prev, setPrev] = useState(0)
    const [latest, setLatest] = useState(0)

    useEffect(() => {
        // data && JSONstringify(data)
        setRefetchCnt(_c => (_c++ > 10 ? 1 : _c))
        if (!isFirstMount) {
            let newLatest = data?.latest
            setPrev(newLatest)
            setLatest(newLatest)
        }
    }, [data, isFirstMount])

    let { mutate: placeOrder, error: er } = useMutation(
        (vars: Record<string, any>) => wretch('/api/placeOrder').post(vars).json(),
        {
            onError: er => {
                console.log('er', er)
            },
            onSuccess: data => {
                JSONstringify(data)
            },
        }
    )

    // useEffect(() => {
    // if (!isFirstMount) {
    // console.log('er', er)
    // }
    // }, [isFirstMount, er])

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <ButtonGroup variant='solid' size='lg' spacing='20'>
                    <Button colorScheme='darkgreen' onClick={() => placeOrder({ buy: true })}>
                        Long
                    </Button>
                    <Button colorScheme='darkred' onClick={() => placeOrder({ sell: true })}>
                        Short
                    </Button>
                </ButtonGroup>
            </main>

            <footer className={styles.footer}>
                <div>
                    <div>{new Array(refetchCnt).fill('*').join('')}</div>
                    {latest && (
                        <div>
                            latest: {latest}
                            {prev && <span> {latest > prev ? ' UP' : ' DOWN'}</span>}
                        </div>
                    )}
                </div>
            </footer>
        </div>
    )
}

export default Home
