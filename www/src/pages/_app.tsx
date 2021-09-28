import '../styles/global.scss'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ChakraProvider } from '@chakra-ui/react'
import { ThemeConfig, extendTheme } from '@chakra-ui/react'
import { useMountedState } from 'react-use'
import React, {
    useCallback,
    useRef,
    useState,
    useLayoutEffect,
    ReactNode,
    useEffect,
    ReactElement,
} from 'react'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
})

const config: ThemeConfig = {
    initialColorMode: 'dark',
    useSystemColorMode: false,
}

const theme = extendTheme({
    styles: {
        global: {
            'html, body': {
                // bg: 'gray.900',
                // color: 'gray.100',
            },
        },
    },
    colors: {
        darkgreen: {
            50: '#00bf00',
            100: '#00bf00',
            200: '#006200', // static
            300: '#008900', // hover
            400: '#00b100', // active
            500: '#004000',
            600: '#004000',
            700: '#004000',
            800: '#004000',
            900: '#004000',
        },
        darkred: {
            50: '#00bf00',
            100: '#00bf00',
            200: '#890000', // static
            300: '#b10000', // hover
            400: '#d80000', // active
            500: '#004000',
            600: '#004000',
            700: '#004000',
            800: '#004000',
            900: '#004000',
        },
    },
    components: {
        Button: {
            variants: {
                solid: { color: 'white' },
            },
        },
    },
    config,
})

function App({ Component, pageProps }: AppProps) {
    useEffect(() => {
        document.body.style.background = 'var(--chakra-colors-gray-800)'
    }, [])
    // useEffect(() => {
    //     if ('serviceWorker' in navigator) {
    //         window.addEventListener('load', function () {
    //             navigator.serviceWorker.register('/sw.js').then(
    //                 function (registration) {
    //                     console.log('Service Worker registration successful with scope: ', registration.scope)
    //                 },
    //                 function (err) {
    //                     console.log('Service Worker registration failed: ', err)
    //                 }
    //             )
    //         })
    //     }
    // }, [])

    // const workerRef = useRef<Worker | undefined>()
    // useEffect(() => {
    //     workerRef.current = new Worker(new URL('../worker/worker.ts', import.meta.url))
    //     workerRef.current.onmessage = (evt) => alert(`WebWorker Response => ${evt.data}`)
    //     return () => {
    //         workerRef.current?.terminate()
    //     }
    // }, [])

    // const handleWork = useCallback(async () => {
    //     workerRef.current?.postMessage(100000)
    // }, [])

    return (
        <QueryClientProvider client={queryClient}>
            <ChakraProvider resetCSS theme={theme}>
                <div>
                    {/* <button onClick={handleWork}>Calculate PI</button> */}

                    <Component {...pageProps} />
                </div>
            </ChakraProvider>
        </QueryClientProvider>
    )
}
const NoSSRComponent = ({ children }: { children: ReactElement }) => {
    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
    }, [])

    return mounted ? children : <main>empty</main>
}

/* eslint-disable react/display-name */
const NoSSR = (Component: any) => (props: any) =>
    (
        <NoSSRComponent>
            <Component {...props} />
        </NoSSRComponent>
    )

export default NoSSR(App)
