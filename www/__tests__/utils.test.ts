import { priceAddPercent } from '../utils'

describe('Default', () => {
    it('priceAddPercent', () => {
        expect(priceAddPercent({ price: 1.1, percent: 0.05, isPlus: true, decimals: 4 })).toBe(1.1006)
    })
})
