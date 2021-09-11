export function JSONstringify(json: any) {
    if (typeof json != 'string') {
        json = JSON.stringify(json, undefined, '\t')
    }

    var arr = [],
        _string = 'color:green',
        _number = 'color:darkorange',
        _boolean = 'color:blue',
        _null = 'color:magenta',
        _key = 'color:red'

    json = json.replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
        function (match: any) {
            var style = _number
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    style = _key
                } else {
                    style = _string
                }
            } else if (/true|false/.test(match)) {
                style = _boolean
            } else if (/null/.test(match)) {
                style = _null
            }
            arr.push(style)
            arr.push('')
            return '%c' + match + '%c'
        }
    )

    arr.unshift(json)

    console.log.apply(console, arr)
}

const roundDecimals = (n: number, decimals: number) => {
    return Math.round((n + Number.EPSILON) * 10 ** decimals) / 10 ** decimals
}

export const priceAddPercent = ({
    percent,
    isPlus,
    price,
    decimals,
}: {
    price: number
    percent: number
    decimals: number
    isPlus: boolean
}) => {
    let n = price + ((isPlus ? 1 : -1) * (price * percent)) / 100
    if (decimals) {
        n = roundDecimals(n, decimals)
    }
    return n
}

// export const calculateDifPercent = ({
//     price1,
//     price2,
//     decimals,
// }: {
//     price1: number
//     price2: number
//     decimals: number
// }) => {
//     let n = (100 * Math.abs(newLimitPrice - oldLimitPrice)) / oldLimitPrice
//     if (decimals) {
//         n = roundDecimals(n, decimals)
//     }
//     return n
// }

export const sleep = (ms: number) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(undefined)
        }, ms)
    })
}
