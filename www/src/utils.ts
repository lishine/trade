import { subscribe } from 'valtio'
import { subscribeKey } from 'valtio/utils'

export function JSONstringify(json: any) {
    if (typeof json != 'string') {
        json = JSON.stringify(json, undefined, '\t')
    }

    let arr = [],
        _string = 'color:green',
        _number = 'color:darkorange',
        _boolean = 'color:blue',
        _null = 'color:magenta',
        _key = 'color:red'

    json = json.replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
        function (match: any) {
            let style = _number
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

    /* eslint-disable prefer-spread */
    console.log.apply(console, arr)
}

export const roundDecimals = (n: number, decimals: number) => {
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
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(undefined)
        }, ms)
    })
}

export const waitForStateOnce = ([proxyObject, key]: [any, string?], fn: () => void) => {
    if (key) {
        let unsubscribe = subscribeKey(proxyObject, key, () => {
            unsubscribe()
            fn()
        })
    } else {
        let unsubscribe = subscribe(proxyObject, () => {
            unsubscribe()
            fn()
        })
    }
}

export const runAndSubscribeKey = (proxyObject: any, key: string, fn: () => void) => {
    fn()
    return subscribeKey(proxyObject, key, fn)
}

export const runAndSubscribeFew = (ar: [any, string?][], fn: () => void) => {
    fn()
    let subscriptions = [] as (() => void)[]
    ar.forEach((p) => {
        subscriptions.push(p[1] ? subscribeKey(p[0], p[1], fn) : subscribe(p[0], fn))
    })
    return () => {
        subscriptions.forEach((s) => s())
    }
}

export function roughSizeOfObject(object: any) {
    var objectList = []
    var stack = [object]
    var bytes = 0

    while (stack.length) {
        var value = stack.pop()

        if (typeof value === 'boolean') {
            bytes += 4
        } else if (typeof value === 'string') {
            bytes += value.length * 2
        } else if (typeof value === 'number') {
            bytes += 8
        } else if (typeof value === 'object' && objectList.indexOf(value) === -1) {
            objectList.push(value)

            for (var i in value) {
                stack.push(value[i])
            }
        }
    }
    return bytes
}
