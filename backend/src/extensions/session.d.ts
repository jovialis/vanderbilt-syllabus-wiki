/**
 * Created by jovialis (Dylan Hanson) on 1/27/22.
 */

import {User} from "../models/user.model.js";
import {Document} from "mongoose";

declare module 'express-session' {
    interface SessionData {
        user: Document<User> | null;
    }
}