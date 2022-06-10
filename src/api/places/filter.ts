import { Like } from "typeorm"

export default function createFilter(params: object = {}): object | null {
    let filter = {}
    let skipParams = ['take', 'skip']

    Object.keys(params).forEach((key) => {
        if (!skipParams.includes(key)) {
            filter[key] = Like(`%${params[key]}%`)
        }
    })

    return filter
}