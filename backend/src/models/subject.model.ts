/**
 * Created by jovialis (Dylan Hanson) on 1/24/22.
 */

import pkg from "mongoose";
import {Subject} from "@vanderbilt/yes-api";

export default function modelSubject(): pkg.Model<Subject> {
    if (!pkg.modelNames().includes('Subject')) {
        return pkg.model<Subject>('Subject', new pkg.Schema({
            _id: {
                type: String,
                uppercase: true,
                // default: () => nanoid()
            },

            id: {
                type: String,
                required: true
            },

            name: {
                type: String,
                required: true
            }
        }, {
            collection: 'subjects',
            timestamps: true
        }));
    }
    return pkg.model<Subject>('Subject');
}
