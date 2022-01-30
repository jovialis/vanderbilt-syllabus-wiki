/**
 * Created by jovialis (Dylan Hanson) on 1/25/22.
 */

import modelSection from "../models/section.model.js";
import {SectionID} from "@vanderbilt/yes-api";
import {hasNext, paginate} from "./paginate.helper.js";
// import {BlankAPISearchResponse} from "shared";
import {APICourse, APISearchResponse, APITerm, BlankAPISearchResponse} from "shared";

export async function searchSections(term: string, curPage: number = 0): Promise<APISearchResponse> {
    const SectionModel = modelSection();

    let aggrResults: {
        id: SectionID,
        term: string,
        abbreviation: string,
        abbreviationFull: string,
        course: string,
        professors: string[],
        syllabi: {
            id: string,
            location: string
        }[]
    }[] = await SectionModel.aggregate(
        [{
            $addFields: {
                'course.joined_abbreviation': {
                    $replaceAll: {
                        input: '$course.abbreviation',
                        find: ' ',
                        replacement: ''
                    }
                }
            }
        }, {
            $addFields: {
                search: {
                    $concat: [
                        '$course.joined_abbreviation',
                        ' ',
                        '$course.abbreviation',
                        ' ',
                        '$course.name'
                    ]
                }
            }
        }, {
            $match: {
                search: {
                    $regex: new RegExp(term.toLowerCase(), 'i')
                }
            }
        }, {
            $lookup: {
                from: 'terms',
                localField: 'term',
                foreignField: '_id',
                as: 'term'
            }
        }, {
            $unwind: {
                path: '$term'
            }
        }, {
            $addFields: {
                'term.index': {
                    $toInt: '$term.id'
                }
            }
        }, {
            $lookup: {
                from: 'syllabi',
                localField: '_id',
                foreignField: 'section',
                as: 'syllabi'
            }
        }, {
            $sort: {
                'term.index': -1
            }
        }, {
            $project: {
                id: "$_id",
                _id: 0,
                term: '$term.title',
                abbreviation: '$course.abbreviation',
                abbreviationFull: {
                    $concat: [
                        '$course.abbreviation',
                        '-',
                        '$number'
                    ]
                },
                course: '$course.name',
                professors: '$instructors',
                syllabi: {
                    $map: {
                        input: '$syllabi',
                        as: 'syllabus',
                        'in': {
                            id: '$$syllabus._id',
                            location: '$$syllabus.location'
                        }
                    }
                }
            }
        }]
    );

    // Paginate the results before processing.
    const results = paginate(aggrResults, curPage);

    if (results.length === 0) {
        return BlankAPISearchResponse;
    }

    let allResults: APITerm[] = [];

    let curTerm: APITerm = null;
    let curCourse: APICourse = null;

    // Group by term then by
    for (const section of results) {
        if (!curTerm || !curCourse) {
            curTerm = {
                id: section.term,
                courses: []
            };

            curCourse = {
                name: section.course,
                abbreviation: section.abbreviation,
                sections: []
            };
        }

        // console.log('Cur Course Term: ' + curTerm.id + " vs. Section Term Name: " + section.term)

        if (curTerm.id !== section.term) {
            curTerm.courses.push(curCourse);
            allResults.push(Object.assign({}, curTerm));
            // console.log(curTerm);
            curTerm = {
                id: section.term,
                courses: []
            };
            curCourse = {
                name: section.course,
                abbreviation: section.abbreviation,
                sections: []
            };
        }

        // console.log('Cur Course Name: ' + curCourse.name + " vs. Section Course Name: " + section.course)

        if (curCourse.name !== section.course) {
            curTerm.courses.push(Object.assign({}, curCourse));
            // console.log(curCourse)
            curCourse = {
                name: section.course,
                abbreviation: section.abbreviation,
                sections: []
            };
        }

        curCourse.sections.push(Object.assign({}, {
            id: section.id,
            abbreviationFull: section.abbreviationFull,
            professors: section.professors,
            syllabi: section.syllabi
        }));
        // console.log(curCourse.sections)
    }

    curTerm.courses.push(curCourse);
    allResults.push(curTerm);

    return {
        data: allResults,
        pagination: {
            page: curPage,
            hasNext: hasNext(aggrResults, curPage)
        }
    };
}