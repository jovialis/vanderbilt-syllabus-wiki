/**
 * Created by jovialis (Dylan Hanson) on 1/21/22.
 */

import {ServerBoilerplate} from "express-server-boilerplate";
import multer from "multer";
import multerS3 from "multer-s3";
import pkg from "aws-sdk";
import session from "express-session";
import {nanoid} from "nanoid";
import modelSection from "./models/section.model.js";
import modelSyllabus from "./models/syllabus.model.js";
import initDatabase from "./utils/initDatabase.js";
import {searchSections} from "./helpers/search.helper.js";
import {google} from "googleapis";
import modelUser from "./models/user.model.js";
import MongoStore from "connect-mongo";

// Start the Express server
(async function () {

    initDatabase();

    // Use ServerBoilerplate to start our Express server.
    const server = new ServerBoilerplate();
    server.extendedURLEncoding(true);

    // CORS for frontend
    server.cors({
        credentials: true,
        origin: [
            process.env['FRONTEND_URL']
        ]
    });

    // Express session
    server.handler(app => {
        app.use(session({
            secret: process.env['SESSION_SECRET'],
            resave: true,
            saveUninitialized: true,
            name: 'auth.id',
            cookie: {
                secure: process.env['NODE_ENV'] === 'production',
                domain: process.env['COOKIE_DOMAIN']
            },
            store: MongoStore.create({
                mongoUrl: process.env['MONGODB_URI']
            })
        }));
    });

    server.handler(app => {
        app.get('/search', async (req, res, next) => {
            const query: string = ((<string>req.query["query"]) || "").trim();
            const curPage: number = Number.parseInt(<string>req.query["page"]);

            if (query.length === 0) {
                return res.json({terms: []});
            } else {
                const results = await searchSections(query, curPage);
                return res.json({terms: results})
            }
        });
    });

    /**
     * Handle authentication with Google
     */
    server.handler(app => {
        const User = modelUser();

        app.get('/auth', (req, res, next) => {
            if (req.session.user) {
                // Session user?
                return res.json({
                    user: new User(req.session.user).toJSON()
                });
            } else {
                // Return a URL to login
                // Create a new OAuth client
                const client = new google.auth.OAuth2(
                    process.env['GOOGLE_CLIENT_ID'],
                    process.env['GOOGLE_CLIENT_SECRET'],
                    process.env['AUTH_REDIRECT_URL']
                );

                // Generate an auth URL for the user with our parameters.
                const auth_url = client.generateAuthUrl({
                    state: "GOOGLE_LOGIN",
                    hd: (process.env['NODE_ENV'] === 'production') ? "vanderbilt.edu" : undefined,
                    response_type: "code",
                    scope: "email profile openid",
                });

                return res.json({
                    google: auth_url
                });    // send the Auth URL to the front end
            }
        })

        app.get('/auth/google/token', async (req, res, next) => {
            // Create a new OAuth client
            const client = new google.auth.OAuth2(
                process.env['GOOGLE_CLIENT_ID'],
                process.env['GOOGLE_CLIENT_SECRET'],
                process.env['AUTH_REDIRECT_URL']
            );

            if (!req.query.code) {
                return next(new Error('bad query'));
            }

            const code: string = <string>req.query.code;

            try {
                const token = await client.getToken(code);
                client.setCredentials(token.tokens);

                let oauth2Client = new google.auth.OAuth2();    // create new auth client
                oauth2Client.setCredentials({access_token: token.tokens.access_token});    // use the new auth client with the access_token

                let oauth2 = google.oauth2({
                    auth: oauth2Client,
                    version: 'v2'
                });

                // Extract user profile
                let {data: profile} = await oauth2.userinfo.get();    // get user info
                const {id: googleID, name, picture: portrait, email, hd: domain} = profile;

                // Validate the domain of the user
                if ((process.env['NODE_ENV'] === 'production') && (!domain || domain.toLowerCase() !== 'vanderbilt.edu')) {
                    return next('bad login');
                }

                // Create the user.
                if (await User.exists({googleID})) {
                    // @ts-ignore
                    req.session.user = (await User.findOne({
                        googleID
                    })).toObject();
                } else {
                    // @ts-ignore
                    req.session.user = (await User.create({
                        googleID,
                        name,
                        portrait,
                        email
                    })).toObject();
                }

                res.json({
                    success: true
                });
            } catch (e) {
                return next(e);
            }
        })
    });

    // File upload
    server.handler(app => {
        const SectionModel = modelSection();
        const SyllabusModel = modelSyllabus();

        const S3_BUCKET = 'syllabus-wiki-uploads';

        const s3 = new pkg.S3({
            accessKeyId: process.env['S3_KEY'],
            secretAccessKey: process.env['S3_SECRET']
        });

        // Helper function to delete the file
        async function deleteFile(key: string) {
            await s3.deleteObject({
                Bucket: S3_BUCKET,
                Key: key
            }).promise();
        }

        const upload = multer({
            fileFilter: function (req, file, callback) {
                // Validate filetype
                if (file.mimetype !== 'application/pdf') {
                    return callback(new Error('Only PDFs are allowed'))
                }

                callback(null, true);
            },
            storage: multerS3({
                s3: s3,
                bucket: S3_BUCKET,
                key: function (req, file, cb) {
                    const id = nanoid();
                    req.uploadID = id;
                    cb(null, "public/" + id);
                },
                contentType: multerS3.AUTO_CONTENT_TYPE
            })
        });

        app.post(
            '/upload',
            [
                (req, res, next) => {
                    if (!req.session.user)
                        return next(new Error('User must login'));
                    return next();
                },
                upload.single('file')
            ],
            async (req, res, next) => {
                const fileLocation: string = req.file.location;
                const fileKey = req.file.key;

                // Validate user
                if (!req.session.user) {
                    await deleteFile(fileKey);
                    console.log('Deleted ' + fileKey);
                    return next(new Error('User must login'));
                }

                // Validate Section
                const sectionID = req.body.section;
                if (!sectionID) {
                    await deleteFile(fileKey);
                    console.log('Deleted ' + fileKey)
                    return next(new Error('Invalid Section submitted.'));
                }

                // Find the section
                const section = await SectionModel.findById(sectionID);

                // No Section? Return error
                if (!section) {
                    await deleteFile(fileKey);
                    console.log('Deleted ' + fileKey)
                    return next(new Error('Invalid Section submitted.'));
                }

                // Create a Syllabus
                const syllabus = await SyllabusModel.create({
                    _id: req.uploadID,
                    section: section._id,
                    location: fileLocation,
                    user: req.session.user._id
                });

                console.log(`Uploaded syllabus ${syllabus._id}`);
                res.json({success: true});
            }
        );
    });

    // Start the server
    await server.start(process.env['PORT']);
    console.log('Up and running!')

}());