import { LinearClient } from 'bybit-api'

const API_KEY = 'DGbm4b3GusCK3K28rf'
const PRIVATE_KEY = 'W8s7LgbDmsv6Hf2VRRXCPc7OM9XhUZnYJ44p'
const useLivenet = true

export const client = new LinearClient(
    API_KEY,
    PRIVATE_KEY,

    // optional, uses testnet by default. Set to 'true' to use livenet.
    useLivenet

    // restClientOptions,
    // requestLibraryOptions
)
