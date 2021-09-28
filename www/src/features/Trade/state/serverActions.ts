import wretch from 'wretch'
import { derivedState, state } from '~/features/Trade/state/state'

// export const placeOrder = () => {
//     wretch('/api/placeBinanceOrder')
//         .post({
//             isLong: state.isLong,
//             symbol: state.symbol,
//             quantity: state.investment / state.lastPrice,
//             exitPrice: derivedState.exitPrice,
//             stopLossPrice: derivedState.stopLossPrice,
//         })
//         .json()
// }
