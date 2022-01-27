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

// Start the Express server
(async function () {

    initDatabase();

    // Use ServerBoilerplate to start our Express server.
    const server = new ServerBoilerplate();
    server.extendedURLEncoding(true);

    // CORS for frontend
    server.cors({
        credentials: false
    });

    // Express session
    server.handler(app => {
        app.use(session({
            secret: 'tacocat',
            resave: true,
            saveUninitialized: true,
            name: 'auth.id',
            cookie: {
                secure: "auto",
                domain: '.syllabus.wiki'
            }
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
                upload.single('file')
            ],
            async (req, res, next) => {
                const fileLocation: string = req.file.location;
                const fileKey = req.file.key;

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
                    location: fileLocation
                });

                console.log(`Uploaded syllabus ${syllabus._id}`);
                res.json({success: true});
            }
        );
    });

    // Start the server
    await server.start("3001");
    console.log('Up and running!')

}());