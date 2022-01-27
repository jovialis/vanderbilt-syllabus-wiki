/**
 * Created by jovialis (Dylan Hanson) on 1/24/22.
 */

import pkg from "mongoose";
import {nanoid} from "nanoid";

interface Syllabus {
    _id: string,
    section: string,
    location: string
}

export default function modelSyllabus(): pkg.Model<Syllabus> {
    if (!pkg.modelNames().includes('Syllabus')) {
        return pkg.model<Syllabus>('Syllabus', new pkg.Schema({
            _id: {
                type: String,
                default: () => nanoid()
            },

            section: {
                type: String,
                required: true,
                ref: 'Section'
            },

            location: {
                type: String,
                required: true
            }

        }, {
            collection: 'syllabi',
            timestamps: true
        }));
    }
    return pkg.model<Syllabus>('Syllabus');
}
