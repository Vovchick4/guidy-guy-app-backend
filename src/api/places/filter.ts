export default function createFilter(params: object = {}): object | null {
    let filter = {}
    let skipParams = ['take', 'skip']

    Object.keys(params).forEach((key) => {
        if (!skipParams.includes(key)) {
            filter[key] = new RegExp(params[key], 'i')
        }
    })

    return filter
}