export let dummy = 0

// export let binanceWsClient: WebSocket

// export const isConnected = () => {
//     if (!binanceWsClient || binanceWsClient.readyState !== 1) {
//         return false
//     } else {
//         return true
//     }
// }

// export const newWsBinanceConnection = () => {
//     if (binanceWsClient) {
//         binanceWsClient.close()
//     }
//     binanceWsClient = new WebSocket('wss://fstream.binance.com')
//     binanceWsClient.onopen = function f() {
//         console.log('client opening')
//     }
//     binanceWsClient.onclose = function f() {
//         console.log('client closing')
//     }

//     binanceWsClient.onmessage = function message(event) {
//         console.log(`message ${event.data}`)
//     }
// }
