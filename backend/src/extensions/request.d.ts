/**
 * Created by jovialis (Dylan Hanson) on 1/25/22.
 */

declare global {
    namespace Express {
        export interface Request {
            uploadID?: string
        }
    }
}
