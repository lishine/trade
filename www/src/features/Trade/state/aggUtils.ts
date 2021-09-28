import { chunk, sortBy } from 'lodash-es'
import { TTick } from '~/features/Trade/localConstants'
import { TDataLevelsResidue } from '~/features/Trade/state/dataState'

function findMinMax(d: TTick[]) {
    let min = d[0].price
    let max = d[0].price
    let indMax = 0
    let indMin = 0
    d.forEach((t, i) => {
        if (t.price < min) {
            min = t.price
            indMin = i
        } else if (t.price > max) {
            max = t.price
            indMax = i
        }
    })
    return { min: d[indMin], max: d[indMax] }
}

const doAvg = ({ data, base }: { data: TTick[]; base: number }) => {
    let d: TTick[] = []
    let chunks = chunk(data, base)
    chunks.forEach((c) => {
        let prices = c.map((v) => v.price)
        let firstPrice = prices[0]
        let lastPrice = prices[prices.length - 1]
        let { min, max } = findMinMax(c)
        let choosen: TTick[] = []
        if (max.price >= firstPrice && max.price >= lastPrice) {
            choosen.push(max)
        }
        if (min.price <= firstPrice && min.price <= lastPrice) {
            choosen.push(min)
        }
        if (choosen.length === 0) {
            choosen.push(c[Math.round(base / 2)])
        }
        choosen = sortBy(choosen, 'time')
        d.push(...choosen)
    })
    return d
}

const base = 3
const _max_level_ = 100

// averaging done using n-base points from previous level, and saved to the next level
// data can be added from the left(past) or from the right(future - websockets)
// residue is saved for the next data
// isPast=true => prepend data
export const doAggData = ({
    isPrepend,
    addData,
    aggData,
    dataLevelsResidue,
}: {
    isPrepend: boolean
    addData: TTick[]
    aggData: TTick[][]
    dataLevelsResidue: TDataLevelsResidue
}) => {
    let dir: 'left' | 'right' = isPrepend ? 'left' : 'right'
    let shift: 'unshift' | 'push' = isPrepend ? 'unshift' : 'push'

    aggData[0] = aggData[0] ?? []

    aggData[0][shift](...addData)
    dataLevelsResidue[dir][0] = dataLevelsResidue[dir][0] ?? []
    dataLevelsResidue[dir][0][shift](...addData)

    for (let level = 1; level <= _max_level_; level++) {
        let newDataCount =
            dataLevelsResidue[dir][level - 1].length - (dataLevelsResidue[dir][level - 1].length % base)
        if (newDataCount === 0) {
            break
        }

        let newDataToProcess: TTick[]
        if (dir === 'left') {
            newDataToProcess = dataLevelsResidue[dir][level - 1].splice(-newDataCount)
        } else {
            newDataToProcess = dataLevelsResidue[dir][level - 1].splice(0, newDataCount)
        }
        let processedData = doAvg({ data: newDataToProcess, base })

        aggData[level] = aggData[level] ?? []
        aggData[level][shift](...processedData)

        dataLevelsResidue[dir][level] = dataLevelsResidue[dir][level] ?? []
        dataLevelsResidue[dir][level][shift](...processedData)
    }
}
