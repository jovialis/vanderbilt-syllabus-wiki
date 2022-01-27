/**
 * Created by jovialis (Dylan Hanson) on 1/25/22.
 */

import modelSection from "../models/section.model.js";
import {SectionID} from "@vanderbilt/yes-api";
import {paginate} from "./paginate.helper.js";

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

export async function searchSections(term: string, curPage: number = 0): Promise<SearchSectionTerm[]> {
    const SectionModel = modelSection();

    let results: {
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
    results = paginate(results, curPage);

    if (results.length === 0)
        return [];

    let allResults: SearchSectionTerm[] = [];

    let curTerm: SearchSectionTerm = null;
    let curCourse: SearchSectionCourse = null;

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

    return allResults;
}

/**
 * [
 *     {
 *         "id": "0980_4616",
 *         "term": "2022 Spring",
 *         "abbreviation": "CS 2201",
 *         "abbreviationFull": "CS 2201-01",
 *         "course": "Program Design and Data Structures",
 *         "professors": [
 *             "Fisher, Douglas H."
 *         ],
 *         "syllabi": [
 *             {
 *                 "id": "QkaLB3YNz140wBdVoOd7W",
 *                 "location": "https://syllabus-wiki-uploads.s3.amazonaws.com/public/QkaLB3YNz140wBdVoOd7W"
 *             }
 *         ]
 *     },
 *     {
 *         "id": "0980_4725",
 *         "term": "2022 Spring",
 *         "abbreviation": "CS 2201",
 *         "abbreviationFull": "CS 2201-02",
 *         "course": "Program Design and Data Structures",
 *         "professors": [
 *             "Roth, Gerald H."
 *         ],
 *         "syllabi": []
 *     },
 *     {
 *         "id": "0980_4945",
 *         "term": "2022 Spring",
 *         "abbreviation": "CS 2201",
 *         "abbreviationFull": "CS 2201-03",
 *         "course": "Program Design and Data Structures",
 *         "professors": [
 *             "Roth, Gerald H."
 *         ],
 *         "syllabi": []
 *     },
 *     {
 *         "id": "0980_5161",
 *         "term": "2022 Spring",
 *         "abbreviation": "CS 2201",
 *         "abbreviationFull": "CS 2201-04",
 *         "course": "Program Design and Data Structures",
 *         "professors": [
 *             "Hajiamini, Shervin"
 *         ],
 *         "syllabi": []
 *     },
 *     {
 *         "id": "0975_4092",
 *         "term": "2021 Fall",
 *         "abbreviation": "CS 2201",
 *         "abbreviationFull": "CS 2201-01",
 *         "course": "Program Design and Data Structures",
 *         "professors": [
 *             "Roth, Gerald H."
 *         ],
 *         "syllabi": []
 *     },
 *     {
 *         "id": "0975_4406",
 *         "term": "2021 Fall",
 *         "abbreviation": "CS 2201",
 *         "abbreviationFull": "CS 2201-02",
 *         "course": "Program Design and Data Structures",
 *         "professors": [
 *             "Roth, Gerald H."
 *         ],
 *         "syllabi": []
 *     },
 *     {
 *         "id": "0975_4654",
 *         "term": "2021 Fall",
 *         "abbreviation": "CS 2201",
 *         "abbreviationFull": "CS 2201-03",
 *         "course": "Program Design and Data Structures",
 *         "professors": [
 *             "Hajiamini, Shervin"
 *         ],
 *         "syllabi": []
 *     },
 *     {
 *         "id": "0975_4870",
 *         "term": "2021 Fall",
 *         "abbreviation": "CS 2201",
 *         "abbreviationFull": "CS 2201-04",
 *         "course": "Program Design and Data Structures",
 *         "professors": [
 *             "Hajiamini, Shervin"
 *         ],
 *         "syllabi": []
 *     },
 *     {
 *         "id": "0960_4253",
 *         "term": "2021 Spring",
 *         "abbreviation": "CS 2201",
 *         "abbreviationFull": "CS 2201-01",
 *         "course": "Program Design and Data Structures",
 *         "professors": [
 *             "Fisher, Douglas H."
 *         ],
 *         "syllabi": []
 *     },
 *     {
 *         "id": "0960_4372",
 *         "term": "2021 Spring",
 *         "abbreviation": "CS 2201",
 *         "abbreviationFull": "CS 2201-02",
 *         "course": "Program Design and Data Structures",
 *         "professors": [
 *             "Roth, Gerald H."
 *         ],
 *         "syllabi": []
 *     },
 *     {
 *         "id": "0960_4603",
 *         "term": "2021 Spring",
 *         "abbreviation": "CS 2201",
 *         "abbreviationFull": "CS 2201-03",
 *         "course": "Program Design and Data Structures",
 *         "professors": [
 *             "Roth, Gerald H."
 *         ],
 *         "syllabi": []
 *     },
 *     {
 *         "id": "0960_4868",
 *         "term": "2021 Spring",
 *         "abbreviation": "CS 2201",
 *         "abbreviationFull": "CS 2201-04",
 *         "course": "Program Design and Data Structures",
 *         "professors": [
 *             "Roth, Gerald H."
 *         ],
 *         "syllabi": []
 *     },
 *     {
 *         "id": "0960_10619",
 *         "term": "2021 Spring",
 *         "abbreviation": "CS 2201",
 *         "abbreviationFull": "CS 2201-05",
 *         "course": "Program Design and Data Structures",
 *         "professors": [
 *             "Hasan, Md Kamrul"
 *         ],
 *         "syllabi": []
 *     },
 *     {
 *         "id": "0955_3990",
 *         "term": "2020 Fall",
 *         "abbreviation": "CS 2201",
 *         "abbreviationFull": "CS 2201-01",
 *         "course": "Program Design and Data Structures",
 *         "professors": [
 *             "Roth, Gerald H."
 *         ],
 *         "syllabi": []
 *     },
 *     {
 *         "id": "0955_4334",
 *         "term": "2020 Fall",
 *         "abbreviation": "CS 2201",
 *         "abbreviationFull": "CS 2201-02",
 *         "course": "Program Design and Data Structures",
 *         "professors": [
 *             "Roth, Gerald H."
 *         ],
 *         "syllabi": []
 *     },
 *     {
 *         "id": "0955_4636",
 *         "term": "2020 Fall",
 *         "abbreviation": "CS 2201",
 *         "abbreviationFull": "CS 2201-03",
 *         "course": "Program Design and Data Structures",
 *         "professors": [
 *             "Fisher, Douglas H."
 *         ],
 *         "syllabi": []
 *     },
 *     {
 *         "id": "0955_4870",
 *         "term": "2020 Fall",
 *         "abbreviation": "CS 2201",
 *         "abbreviationFull": "CS 2201-04",
 *         "course": "Program Design and Data Structures",
 *         "professors": [
 *             "Roth, Gerald H."
 *         ],
 *         "syllabi": []
 *     }
 * ]
 */