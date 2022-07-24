import { Point } from "geojson"

export interface IPlaceParams {
    id: number | null,
    name: string | null,
    like: boolean | false,
    take: number | null,
    skip: number | null
}

export interface IPlaceCreateParams {
    id: number | null,
    name: string | null,
    like: boolean | false,
    file: string | null,
    coordinates: Point | null
}

