/**
 * Created by jovialis (Dylan Hanson) on 1/25/22.
 */

export interface SearchSectionSyllabus {
    id: string
    location: string
}

export interface SearchSection {
    id: string,
    abbreviationFull: string,
    professors: string[],
    syllabi: SearchSectionSyllabus[]
}

export interface SearchSectionCourse {
    name: string
    abbreviation: string
    sections: SearchSection[]
}

export interface SearchSectionTerm {
    id: string,
    courses: SearchSectionCourse[]
}

export function combineSearchResults(a: SearchSectionTerm[], b: SearchSectionTerm[]): SearchSectionTerm[] {
    // for (const term of )
    return [];
}