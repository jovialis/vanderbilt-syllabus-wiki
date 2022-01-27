/**
 * Created by jovialis (Dylan Hanson) on 1/25/22.
 */

import pkg from "mongoose";

export default function initDatabase() {
    pkg.connect(process.env['MONGODB_URI']);
}