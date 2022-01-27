/**
 * Created by jovialis (Dylan Hanson) on 1/24/22.
 */

import pkg from "mongoose";
import {Section} from "@vanderbilt/yes-api";

export default function modelSection(): pkg.Model<Section> {
    if (!pkg.modelNames().includes('Section')) {
        return pkg.model<Section>('Section', new pkg.Schema({
            _id: {
                type: String,
                // default: () => nanoid()
            },

            id: {
                type: String,
                required: true
            },

            term: {
                type: String,
                ref: 'Term',
                required: true
            },

            course: new pkg.Schema({
                subject: {
                    type: String,
                    required: true,
                    ref: 'Subject',
                },

                abbreviation: {
                    type: String,
                    required: true
                },

                name: {
                    type: String,
                    required: true
                }
            }, {
                _id: false,
                skipVersioning: true
            }),

            number: {
                type: String,
                required: true
            },

            instructors: [String],

        }, {
            collection: 'sections',
            timestamps: true
        }));
    }
    return pkg.model<Section>('Section');
}
