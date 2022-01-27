/**
 * Created by jovialis (Dylan Hanson) on 1/24/22.
 */

import pkg from "mongoose";
import {Term} from "@vanderbilt/yes-api";

export default function modelTerm(): pkg.Model<Term> {
    if (!pkg.modelNames().includes('Term')) {
        return pkg.model<Term>('Term', new pkg.Schema({
            _id: {
                type: String,
                // default: () => nanoid()
            },

            id: {
                type: String,
                required: true
            },

            title: {
                type: String,
                required: true
            },

            sessions: [{
                id: {
                    type: String,
                    required: true
                },
                titleShort: {
                    type: String,
                    required: true
                },
                titleLong: {
                    type: String,
                    requireD: true
                }
            }]
        }, {
            collection: 'terms',
            timestamps: true
        }));
    }
    return pkg.model<Term>('Term');
}
