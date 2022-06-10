import { ILike } from "typeorm"

export default function createFilter(params: object = {}): object | null {
    let filter = {}
    let skipParams = ['take', 'skip']

    Object.keys(params).forEach((key) => {
        if (!skipParams.includes(key)) {
            filter[key] = ILike(`%${params[key]}%`)
        }
    })

    return filter
}