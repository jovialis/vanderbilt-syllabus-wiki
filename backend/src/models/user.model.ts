/**
 * Created by jovialis (Dylan Hanson) on 1/24/22.
 */

import pkg from "mongoose";
import {nanoid} from "nanoid";

export interface User {
    _id: string,
    googleID: string,
    name: string,
    picture: string,
    email: string
}

export default function modelUser(): pkg.Model<User> {
    if (!pkg.modelNames().includes('User')) {
        const schema = new pkg.Schema({
            _id: {
                type: String,
                default: () => nanoid()
            },

            googleID: {
                type: String,
                required: true
            },

            name: {
                type: String,
                required: true
            },

            portrait: {
                type: String,
                required: true
            },

            email: {
                type: String,
                required: true
            }
        }, {
            collection: 'users',
            timestamps: true
        });

        schema.set('toJSON', {
            transform: function (doc, ret, options) {
                return {
                    name: doc.name,
                    portrait: doc.portrait,
                    email: doc.email
                };
            }
        });

        return pkg.model<User>('User', schema);
    }
    return pkg.model<User>('User');
}
