/**
 * Created by jovialis (Dylan Hanson) on 1/29/22.
 */

export interface APISyllabus {
    id: string
    location: string
}

export interface APISection {
    id: string,
    abbreviationFull: string,
    professors: string[],
    syllabi: APISyllabus[]
}

export interface APICourse {
    name: string
    abbreviation: string
    sections: APISection[]
}

export interface APITerm {
    id: string,
    courses: APICourse[]
}

export interface APIPagination {
    page: number,
    hasNext: boolean
}

export interface APISearchResponse {
    data: APITerm[],
    pagination: APIPagination
}

export const BlankAPISearchResponse: APISearchResponse = {
    data: [],
    pagination: {
        page: 1,
        hasNext: false
    }
};