/**
 * Created by jovialis (Dylan Hanson) on 1/25/22.
 */

import {APICourse, APITerm} from "shared";

export function combineSearchResults(existing: APITerm[], toAppend: APITerm[]): APITerm[] {
    // Generate a hashmap of the existing IDs
    const existingIDMap: Map<string, APITerm> = new Map<string, APITerm>();
    existing.forEach(s => {
        existingIDMap.set(s.id, s);
    });

    // Iterate over the new ones.
    for (const term of toAppend) {
        // Either combine or append
        if (existingIDMap.has(term.id)) {
            combineSections(existingIDMap.get(term.id)!, term);
        } else {
            existing.push(term);
        }
    }

    return existing;
}

function combineSections(existing: APITerm, toAppend: APITerm): APITerm {
    // Generate a hashmap of the existing courses
    const existingAbbreviationMap: Map<string, APICourse> = new Map<string, APICourse>();
    existing.courses.forEach(c => {
        existingAbbreviationMap.set(c.abbreviation, c);
    });

    // Iterate over the new courses
    for (const course of toAppend.courses) {
        // Either combine or append
        if (existingAbbreviationMap.has(course.abbreviation)) {
            existingAbbreviationMap.get(course.abbreviation)!.sections.push(...course.sections);
        } else {
            existing.courses.push(course);
        }
    }

    return existing;
}