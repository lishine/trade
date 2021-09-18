import '../styles/globals.css'
import type { AppProps } from 'next/app'
import wretch from 'wretch'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ChakraProvider } from '@chakra-ui/react'
import { ThemeConfig, extendTheme } from '@chakra-ui/react'
import { useMountedState } from 'react-use'
import React, { useState, useLayoutEffect, ReactNode, useEffect, ReactElement } from 'react'

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
                // bg: 'gray.800',
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
    return (
        <QueryClientProvider client={queryClient}>
            <ChakraProvider resetCSS theme={theme}>
                <Component {...pageProps} />
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
const NoSSR = (Component: any) => (props: any) =>
    (
        <NoSSRComponent>
            <Component {...props} />
        </NoSSRComponent>
    )

export default NoSSR(App)
